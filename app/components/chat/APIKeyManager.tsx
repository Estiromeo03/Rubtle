import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';

export interface APIKeyManagerProps {
  provider: ProviderInfo;
  setProvider: (provider: ProviderInfo) => void;
  providerList: ProviderInfo[];
  model: string;
  setModel: (model: string) => void;
  modelList: ModelInfo[];
  apiKey: string;
  setApiKey: (key: string) => void;
}

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

export const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  provider,
  setProvider,
  providerList,
  model,
  setModel,
  modelList,
  apiKey,
  setApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);

  // Load saved key when provider changes
  useEffect(() => {
    const savedKeys = getApiKeysFromCookies();
    const savedKey = savedKeys[provider.name] || '';
    setTempKey(savedKey);
    setApiKey(savedKey);
  }, [provider.name]);

  // Ensure model is valid for selected provider
  useEffect(() => {
    const models = modelList.filter((m) => m.provider === provider.name);
    if (models.length > 0 && !models.some((m) => m.name === model)) {
      setModel(models[0].name);
    }
  }, [provider, modelList]);

  const handleKeyChange = (value: string) => {
    setTempKey(value);
    setApiKey(value);
    const newKeys = { ...getApiKeysFromCookies(), [provider.name]: value };
    Cookies.set('apiKeys', JSON.stringify(newKeys));
  };

  return (
    <details className="bg-gray-800 p-4 rounded-md text-white max-w-md">
      <summary className="cursor-pointer font-semibold text-sm">API Settings</summary>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm">Provider</label>
          <select
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
            value={provider.name}
            onChange={(e) => {
              const selected = providerList.find((p) => p.name === e.target.value);
              if (selected) {
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
          <label className="text-sm">Model</label>
          <select
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {modelList
              .filter((m) => m.provider === provider.name)
              .map((m) => (
                <option key={m.name} value={m.name}>
                  {m.label}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="text-sm">API Key</label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded"
            placeholder="Enter API Key"
          />
        </div>
      </div>
    </details>
  );
};

