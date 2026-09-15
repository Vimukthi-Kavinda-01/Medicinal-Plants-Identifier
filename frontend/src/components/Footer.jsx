import React from 'react';
import { PottedPlant, Heart } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-herb-900 text-herb-200 py-10 px-4 border-t border-herb-800">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-herb-700 flex items-center justify-center text-white">
            <PottedPlant size={16} weight="fill" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">HerbSense</span>
            <span className="text-herb-300 ml-1.5">• Medicinal Plants Identifier</span>
          </div>
        </div>

        <div className="text-herb-300">
          Powered by{' '}
          <a
            href="https://roboflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline font-semibold"
          >
            Roboflow AI
          </a>{' '}
          & React
        </div>

        <div className="text-herb-400">
          © {new Date().getFullYear()} HerbSense. For educational use.
        </div>
      </div>
    </footer>
  );
}

