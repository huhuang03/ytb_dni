import {KEY_TELL_US_WHY} from './common/constants';

const CB_ID = 'cbClickTellNotInterest'
declare var chrome: any

const sync = (value, callback) => {
  chrome.storage.local.get(
    {[KEY_TELL_US_WHY]: value},
    (items) => {
      const hasValue = value !== null && value !== undefined
      let tell = items[KEY_TELL_US_WHY]
      if (hasValue) {
        tell = !!value
      }
      tell = !!tell
      const cb = document.getElementById(CB_ID) as HTMLInputElement
      cb.checked = tell
      if (value !== null && value !== undefined) {
        chrome.storage.local.set({
          [KEY_TELL_US_WHY]: tell
        })
      }
      callback && callback()
    }
  );
}

sync(null, () => {
  const cb = document.getElementById(CB_ID);
  cb.addEventListener('change', (ev) => {
    const target = ev.target as HTMLInputElement
    sync(target.checked, null);
  });
});

