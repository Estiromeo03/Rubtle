import React, { useState, useEffect, useCallback } from 'react';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';
import Cookies from 'js-cookie';

interface APIKeyManagerProps {
  provider: ProviderInfo;
  providerList: ProviderInfo[];
  setProvider?: (provider: ProviderInfo) => void;
  model: string;
  modelList: ModelInfo[];
  setModel?: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

// cache which stores whether the provider's API key is set via environment variable
const providerEnvKeyStatusCache: Record<string, boolean> = {};

const apiKeyMemoizeCache: { [k: string]: Record<string, string> } = {};

export function getApiKeysFromCookies() {
  const storedApiKeys = Cookies.get('apiKeys');
  let parsedKeys: Record<string, string> = {};

  if (storedApiKeys) {
    parsedKeys = apiKeyMemoizeCache[storedApiKeys];

    if (!parsedKeys) {
      parsedKeys = apiKeyMemoizeCache[storedApiKeys] = JSON.parse(storedApiKeys);
    }
  }

  return parsedKeys;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  provider,
  providerList,
  setProvider,
  model,
  modelList,
  setModel,
  apiKey,
  setApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [isEnvKeySet, setIsEnvKeySet] = useState(false);

  // Reset states and load saved key when provider changes
  useEffect(() => {
    // Load saved API key from cookies for this provider
    const savedKeys = getApiKeysFromCookies();
    const savedKey = savedKeys[provider.name] || '';

    setTempKey(savedKey);
    setApiKey(savedKey);
  }, [provider.name]);

  const checkEnvApiKey = useCallback(async () => {
    // Check cache first
    if (providerEnvKeyStatusCache[provider.name] !== undefined) {
      setIsEnvKeySet(providerEnvKeyStatusCache[provider.name]);
      return;
    }

    try {
      const response = await fetch(`/api/check-env-key?provider=${encodeURIComponent(provider.name)}`);
      const data = await response.json();
      const isSet = (data as { isSet: boolean }).isSet;

      // Cache the result
      providerEnvKeyStatusCache[provider.name] = isSet;
      setIsEnvKeySet(isSet);
    } catch (error) {
      console.error('Failed to check environment API key:', error);
      setIsEnvKeySet(false);
    }
  }, [provider.name]);

  useEffect(() => {
    checkEnvApiKey();
  }, [checkEnvApiKey]);

  const handleSave = (key: string) => {
    setApiKey(key);
    const currentKeys = getApiKeysFromCookies();
    const newKeys = { ...currentKeys, [provider.name]: key };
    Cookies.set('apiKeys', JSON.stringify(newKeys));
  };

  const filteredModels = modelList.filter((m) => m.provider === provider.name);

  return (
    <details className="mb-2">
      <summary className="cursor-pointer px-4 py-1 border border-gray-400 rounded-full inline-block text-sm font-medium text-white">
        User API Model
      </summary>
      <div className="mt-3 space-y-3 text-sm">
        <div>
          <label>Provider</label>
          <select
            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1"
            value={provider.name}
            onChange={(e) => {
              const selected = providerList.find((p) => p.name === e.target.value);
              if (selected && setProvider) {
                setProvider(selected);
              }
            }}
          >
            {providerList.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Model</label>
          <select
            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1"
            value={model}
            onChange={(e) => setModel?.(e.target.value)}
          >
            {filteredModels.map((m) => (
              <option key={m.name} value={m.name}>
                {m.label || m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>API Key</label>
          <input
            type="password"
            placeholder="Enter API Key"
            value={tempKey}
            onChange={(e) => {
              const key = e.target.value;
              setTempKey(key);
              handleSave(key);
            }}
            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white"
          />
        </div>
      </div>
    </details>
  );
};
