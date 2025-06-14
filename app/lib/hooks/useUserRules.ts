import { useStore } from '@nanostores/react';
import { userRulesStore, updateUserRules } from '~/lib/stores/userRules';

export function useUserRules() {
  const rules = useStore(userRulesStore);

  const setRules = (newRules: string) => {
    updateUserRules(newRules);
  };

  return { rules, setRules };
}
