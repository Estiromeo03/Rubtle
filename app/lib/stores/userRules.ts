import { atom } from 'nanostores';

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('userRules') || '' : '';

export const userRulesStore = atom<string>(stored);

export const updateUserRules = (rules: string) => {
  userRulesStore.set(rules);
  if (typeof localStorage !== 'undefined') {
    if (rules) {
      localStorage.setItem('userRules', rules);
    } else {
      localStorage.removeItem('userRules');
    }
  }
};
