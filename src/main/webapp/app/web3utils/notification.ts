import { TIconType } from 'app/components/Icon/collection';
import { useNotification } from 'web3uikit';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';

import React, { useCallback } from 'react';

export const useNotificationCustom = () => {
  const dispatch = useNotification();
  const handleNewNotification = useCallback((type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Notification',
      icon,
      position: position || 'bottomL',
    });
  }, []);
  const handleNewNotification2 = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Notification',
      icon,
      position: position || 'bottomL',
    });
  };

  return {
    handleNewNotification,
    handleNewNotification2,
  };
};
