import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`p-3 rounded-xl flex-shrink-0 ${
            isDestructive
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
          {message}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition shadow-sm ${
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
