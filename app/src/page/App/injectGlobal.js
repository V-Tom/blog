import Notification from '../../component/Notification';
import Spinner from '../../component/Spinner';
import Header from '../Header';

window.Header = ['show', 'hide', 'isActive'].reduce(
  (a, b) => ({
    ...a,
    ...{
      [b]: () => {},
    },
  }),
  Object.create(null),
);

/**
 * Notification
 */
window.Notification = Notification;
/**
 * Spinner
 */
window.Spinner = Spinner;
/**
 * Header
 */
window.Header = Header;
