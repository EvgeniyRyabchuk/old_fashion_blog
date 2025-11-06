// Message status constants
const MESSAGE_STATUSES = {
  PENDING: 'pending',
  IN_WORK: 'in-work',
  DONE: 'done',
};

const MESSAGE_STATUS_OPTIONS = [
  { value: MESSAGE_STATUSES.PENDING, labelKey: 'status-pending', label: 'Pending' },
  { value: MESSAGE_STATUSES.IN_WORK, labelKey: 'status-in-work', label: 'In Work' },
  { value: MESSAGE_STATUSES.DONE, labelKey: 'status-done', label: 'Done' },
];

export { 
  MESSAGE_STATUSES,
  MESSAGE_STATUS_OPTIONS 
};