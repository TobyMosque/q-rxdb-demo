import { store } from 'quasar/wrappers';
import createStore, { StoreOptions } from './store';
/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
import { Dialog } from 'quasar';

export default store((/* { ssrContext } */) => {
  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  const options: StoreOptions = {
    compression: true,
    encryption: true,
  };

  if (process.env.MODE === 'electron') {
    options.getPasswordAsync = async () => {
      await new Promise((resolve) =>
        Dialog.create({
          message: 'you would ask the user by the password here',
        }).onOk(resolve)
      );

      const secret = 'KeetItSuperSecret$512';
      return window.getPassword(secret);
    };
  } else {
    options.getPassword = () => {
      return 'KeetItSuperSecret$512';
    };
  }

  const store = createStore(options);
  return store;
});
