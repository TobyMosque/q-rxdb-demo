import hash from 'object-hash';
import { LocalStorage } from 'quasar';

export function createScheme(name, scheme) {
  const _hash = hash({ foo: scheme });
  const info = LocalStorage.getItem('scheme-' + name) || { version: 0 };
  if (info.hash != _hash) {
    info.version = info.version + 1;
    info.hash = _hash;
    LocalStorage.set('scheme-' + name, info);
  }
  console.log(name, info);
  return {
    version: info.version,
    ...scheme,
  };
}
