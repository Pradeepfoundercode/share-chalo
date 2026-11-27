import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from 'lucide-react';

/**
 * RichTextEditor - Clean Custom WYSIWYG Editor
 * Generates clean HTML behind the scenes without requiring users to write HTML tags.
 */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = '',
  minHeight = '140px',
  maxHeight = '280px',
}) {
  const editorRef = useRef(null);
  const [internalHtml, setInternalHtml] = useState(value || '');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  // Keep external value and internal state in sync
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (value !== currentHtml) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setInternalHtml(value || '');
  }, [value]);

  // Update active format state based on current selection
  const checkActiveFormats = useCallback(() => {
    if (!document) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      });
    } catch {
      // Ignore if document queryCommandState fails
    }
  }, []);

  // Execute formatting command without losing focus
  const executeCommand = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand(command, false, val);
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setInternalHtml(html);
        if (onChange) onChange(html);
      }
      checkActiveFormats();
    } catch (e) {
      console.warn('RichTextEditor command error:', e);
    }
  };

  // Handle format block (Heading 1, 2, 3, Paragraph)
  const handleBlockFormat = (tag) => {
    executeCommand('formatBlock', tag);
  };

  // Handle content input in WYSIWYG mode
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      if (onChange) onChange(html);
      checkActiveFormats();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
      {/* ----------------- TOOLBAR ----------------- */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-1.5 sm:p-2 bg-slate-50/90 border-b border-slate-200/80 select-none">
        {/* Left Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {/* Block Format Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              onChange={(e) => handleBlockFormat(e.target.value)}
              className="h-7 text-xs font-semibold px-2 pr-6 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-amber-400 cursor-pointer"
              defaultValue="p"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1 (H1)</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="blockquote">Quote Block</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.bold
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.italic
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.underline
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.strikeThrough
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Bulleted List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.insertUnorderedList
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.insertOrderedList
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', 'blockquote');
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 hover:text-black text-xs font-bold transition-colors cursor-pointer"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Align Left */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyLeft');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.justifyLeft
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Align Center */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyCenter');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.justifyCenter
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Align Right */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyRight');
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              activeFormats.justifyRight
                ? 'bg-[#fed011] text-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200/70 hover:text-black'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Undo */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('undo');
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 hover:text-black text-xs font-bold transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('redo');
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 hover:text-black text-xs font-bold transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5 stroke-[2.4]" />
          </button>
        </div>
      </div>

      {/* ----------------- EDITOR CONTENT AREA ----------------- */}
      <div className="relative bg-white">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={checkActiveFormats}
          onMouseUp={checkActiveFormats}
          style={{ minHeight, maxHeight }}
          data-placeholder={placeholder || ''}
          className={`rich-text-editor-content w-full p-3 text-xs sm:text-sm text-slate-800 font-normal focus:outline-none overflow-y-auto leading-relaxed prose prose-sm max-w-none ${
            placeholder ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none' : ''
          }`}
        />
      </div>
    </div>
  );
}
