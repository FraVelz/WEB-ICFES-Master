'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/features/user/hooks/useUser';
import { useUserData } from '@/features/user/hooks/useUserData';
import { useToast } from '@/shared/components/Toast/ToastProvider';

export function useUserSettingsState() {
  const { user, refreshUser } = useUser();
  const { user: userData, updateUsername, updateBio, updateProfileImage, refresh } = useUserData();

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    showToast(msg, type);
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
