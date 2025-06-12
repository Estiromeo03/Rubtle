import { useState } from 'react';
import { json, type MetaFunction } from '@remix-run/cloudflare';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { Header } from '~/components/header/Header';

interface ElementData {
  id: string;
  tag: string;
  content: string;
  styles: React.CSSProperties;
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Editor Demo' },
    { name: 'description', content: 'Simple element editor demo' },
  ];
};

export const loader = () => json({});

export default function EditorDemo() {
  const [elements, setElements] = useState<ElementData[]>([
    {
      id: '1',
      tag: 'div',
      content: 'Card 1',
      styles: {
        backgroundColor: '#eee',
        padding: '16px',
        margin: '8px',
        color: '#000',
        fontSize: '16px',
      },
    },
    {
      id: '2',
      tag: 'div',
      content: 'Card 2',
      styles: {
        backgroundColor: '#ddd',
        padding: '16px',
        margin: '8px',
        color: '#000',
        fontSize: '16px',
      },
    },
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const updateElementProps = (id: string, updated: Partial<ElementData>) => {
    setElements((els) =>
      els.map((el) =>
        el.id === id
          ? { ...el, ...updated, styles: { ...el.styles, ...(updated.styles || {}) } }
          : el,
      ),
    );
  };

  const selectedElement = elements.find((e) => e.id === selectedElementId);

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-auto" id="canvas">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedElementId(el.id)}
              style={el.styles}
              className={`border cursor-pointer rounded mb-2 ${selectedElementId === el.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {el.content}
            </div>
          ))}
        </div>
        {selectedElement && (
          <div className="w-64 border-l p-4 bg-bolt-elements-background-depth-2">
            <h3 className="text-lg font-semibold mb-2">Edit {selectedElement.tag}</h3>
            <label className="block text-sm">Content</label>
            <input
              type="text"
              value={selectedElement.content}
              onChange={(e) => updateElementProps(selectedElement.id, { content: e.target.value })}
              className="w-full border mb-2 px-1 py-0.5 bg-transparent"
            />
            <label className="block text-sm">Color</label>
            <input
              type="color"
              value={selectedElement.styles.color as string}
              onChange={(e) =>
                updateElementProps(selectedElement.id, {
                  styles: { color: e.target.value },
                })
              }
              className="w-full mb-2 h-8"
            />
            <label className="block text-sm">Font Size</label>
            <input
              type="number"
              value={parseInt((selectedElement.styles.fontSize as string) || '16')}
              onChange={(e) =>
                updateElementProps(selectedElement.id, {
                  styles: { fontSize: `${e.target.value}px` },
                })
              }
              className="w-full border mb-2 px-1 py-0.5 bg-transparent"
            />
            <label className="block text-sm">Margin</label>
            <input
              type="number"
              value={parseInt((selectedElement.styles.margin as string) || '0')}
              onChange={(e) =>
                updateElementProps(selectedElement.id, {
                  styles: { margin: `${e.target.value}px` },
                })
              }
              className="w-full border mb-2 px-1 py-0.5 bg-transparent"
            />
            <label className="block text-sm">Padding</label>
            <input
              type="number"
              value={parseInt((selectedElement.styles.padding as string) || '0')}
              onChange={(e) =>
                updateElementProps(selectedElement.id, {
                  styles: { padding: `${e.target.value}px` },
                })
              }
              className="w-full border mb-2 px-1 py-0.5 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
