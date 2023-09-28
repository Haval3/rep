import { api } from '@rocket.chat/core-services';
import type { IMessage } from '@rocket.chat/core-typings';
import { isDirectMessageRoom, isEditedMessage, isRoomFederated } from '@rocket.chat/core-typings';
import { Subscriptions, Rooms } from '@rocket.chat/models';
import type { ActionsBlock } from '@rocket.chat/ui-kit';
// import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// import _ from 'underscore';

import { callbacks } from '../../../../lib/callbacks';
import { isTruthy } from '../../../../lib/isTruthy';
import { i18n } from '../../../../server/lib/i18n';
import { hasAtLeastOnePermissionAsync, hasPermissionAsync } from '../../../authorization/server/functions/hasPermission';

const permissionsToAddUserToRoom = ['add-user-to-joined-room', 'add-user-to-any-c-room', 'add-user-to-any-p-room'];

const APP_ID = 'mention-core';
const getBlocks = (mentions: IMessage['mentions'], messageId: string) => {
	const strigifiedMentions = JSON.stringify(mentions);
	return {
		addUsersBlock: {
			type: 'button',
			appId: APP_ID,
			blockId: messageId,
			value: strigifiedMentions,
			actionId: 'add-users',
			text: {
				type: 'plain_text',
				text: i18n.t('Add_them'),
			},
		},
		dismissBlock: {
			type: 'button',
			appId: APP_ID,
			blockId: messageId,
			value: strigifiedMentions,
			actionId: 'dismiss',
			text: {
				type: 'plain_text',
				text: i18n.t('Do_nothing'),
			},
		},
		dmBlock: {
			type: 'button',
			appId: APP_ID,
			value: strigifiedMentions,
			blockId: messageId,
			actionId: 'share-message',
			text: {
				type: 'plain_text',
				text: i18n.t('Let_them_know'),
			},
		},
	} as const;
};

callbacks.add(
	'beforeSaveMessage',
	async (message) => {
		// TODO: check if I need to test this 60 second rule.
		// If the message was edited, or is older than 60 seconds (imported)
		// the notifications will be skipped, so we can also skip this validation
		if (isEditedMessage(message) || (message.ts && Math.abs(moment(message.ts).diff(moment())) > 60000) || !message.mentions) {
			return message;
		}

		const room = await Rooms.findOneById(message.rid);
		if (!room || isDirectMessageRoom(room) || isRoomFederated(room) || room.t === 'l') {
			return message;
		}

		const mentions = message.mentions.filter(({ _id }) => _id !== 'all' && _id !== 'here');

		if (!mentions.length) {
			return message;
		}

		const subs = await Subscriptions.findByRoomIdAndUserIds(
			message.rid,
			mentions.map(({ _id }) => _id),
			{ projection: { u: 1 } },
		).toArray();

		// get all users that are mentioned but not in the channel
		const mentionsUsersNotInChannel = mentions.filter(({ _id }) => !subs.some((sub) => sub.u._id === _id));

		if (!mentionsUsersNotInChannel.length) {
			return message;
		}

		const canAddUsers = await hasAtLeastOnePermissionAsync(message.u._id, permissionsToAddUserToRoom, message.rid);
		const canDMUsers = await hasPermissionAsync(message.u._id, 'create-d'); // TODO: Perhaps check if user has DM with mentioned user (might be too expensive)

		const usernames = mentionsUsersNotInChannel.map(({ username }) => username);
		const actionBlocks = getBlocks(mentionsUsersNotInChannel, message._id);
		console.log(actionBlocks);
		const elements: ActionsBlock['elements'] = [
			canAddUsers && actionBlocks.addUsersBlock,
			(canAddUsers || canDMUsers) && actionBlocks.dismissBlock,
			canDMUsers && actionBlocks.dmBlock,
		].filter(isTruthy);

		const messageLabel = canAddUsers
			? 'You_mentioned___mentions__but_theyre_not_in_this_room'
			: 'You_mentioned___mentions__but_theyre_not_in_this_room_You_can_ask_a_room_admin_to_add_them';

		void api.broadcast('notify.ephemeralMessage', message.u._id, message.rid, {
			msg: '',
			mentions: mentionsUsersNotInChannel,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: i18n.t(messageLabel, { mentions: `@${usernames.join(', @')}` }),
					},
				} as const,
				Boolean(elements.length) &&
					({
						type: 'actions',
						elements,
					} as const),
			].filter(isTruthy),
			private: true,
		});

		return message;
	},
	callbacks.priority.LOW,
	'mention-user-not-in-channel',
);