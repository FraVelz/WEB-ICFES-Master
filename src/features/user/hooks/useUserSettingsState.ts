'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/features/user/hooks/useUser';
import { useUserData } from '@/features/user/hooks/useUserData';

export function useUserSettingsState() {
  const { user, refreshUser } = useUser();
  const { user: userData, updateUsername, updateBio, updateProfileImage, refresh } = useUserData();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [supportMode, setSupportMode] = useState('response');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');

  useEffect(() => {
    setUsername(user?.username ?? userData?.displayName ?? userData?.username ?? '');
    setSupportEmail((user?.email ?? userData?.email ?? '') as string);
  }, [user?.username, user?.email, userData?.displayName, userData?.username, userData?.email]);

  useEffect(() => {
    setBio(user?.bio || userData?.bio || '');
  }, [user?.bio, userData?.bio]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  return {
    user,
    refreshUser,
    userData,
    updateUsername,
    updateBio,
    updateProfileImage,
    refresh,
    fileInputRef,
    message,
    messageType,
    loading,
    setLoading,
    username,
    setUsername,
    bio,
    setBio,
    showDeleteModal,
    setShowDeleteModal,
    deleteConfirmation,
    setDeleteConfirmation,
    supportMode,
    setSupportMode,
    supportCategory,
    setSupportCategory,
    supportMessage,
    setSupportMessage,
    supportEmail,
    setSupportEmail,
    showMessage,
  };
}
