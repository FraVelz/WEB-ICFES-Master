'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProfileReportReason } from '@/features/user/constants/profileReportReasons';
import { submitProfileReport } from '@/services/profile/profileReportService';

type UseReportUserDialogOptions = {
  isOpen: boolean;
  reportedUserId: string;
  reportedUserName: string;
  profileUrl: string;
  isAuthenticated: boolean;
  reporterEmail?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export function useReportUserDialog({
  isOpen,
  reportedUserId,
  reportedUserName,
  profileUrl,
  isAuthenticated,
  reporterEmail,
  onClose,
  onSuccess,
}: UseReportUserDialogOptions) {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [reason, setReason] = useState<ProfileReportReason>('inappropriate_content');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason('inappropriate_content');
      setDetails('');
      setSubmitting(false);
      setError(null);
      setSuccess(false);
      return;
    }

    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, submitting]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    const resolvedProfileUrl =
      profileUrl.trim() ||
      (typeof window !== 'undefined'
        ? window.location.href
        : `/perfil/public?userId=${encodeURIComponent(reportedUserId)}`);

    const result = await submitProfileReport({
      reportedUserId,
      reportedUserName,
      profileUrl: resolvedProfileUrl,
      reason,
      details,
      reporterEmail,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    onSuccess?.();
    window.setTimeout(() => onClose(), 1800);
  };

  return {
    cancelRef,
    reason,
    setReason,
    details,
    setDetails,
    submitting,
    error,
    success,
    handleSubmit,
    router,
  };
}
