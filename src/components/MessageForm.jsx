import React, { useState } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const fonts = ['Open Sans', 'Roboto', 'Arial'];
const sizes = [12, 14, 16, 18, 20];

const MessageForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    recipient: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Write a Message</h2>
        <div className="flex gap-2">
          <button type="button" className="text-yellow-500 hover:text-yellow-600 text-lg" title="Collapse"><FaChevronDown /></button>
          <button type="button" className="text-red-500 hover:text-red-600 text-lg" title="Close"><FaTimes /></button>
        </div>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input-box w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Recipient</label>
        <input
          type="text"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
          className="input-box w-full"
        />
      </div>
      {/* Toolbar mockup */}
      <div className="flex items-center gap-2 mb-2">
        <select className="input-box h-8 text-xs w-28">
          {fonts.map(f => <option key={f}>{f}</option>)}
        </select>
        <select className="input-box h-8 text-xs w-14">
          {sizes.map(s => <option key={s}>{s}</option>)}
        </select>
        <button type="button" className="font-bold border px-2 py-1 rounded text-xs">Bold</button>
        <button type="button" className="italic border px-2 py-1 rounded text-xs">/italic</button>
        <button type="button" className="underline border px-2 py-1 rounded text-xs">Underline</button>
        <button type="button" className="border px-2 py-1 rounded text-xs">=</button>
        <button type="button" className="border px-2 py-1 rounded text-xs">≡</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="input-box w-full min-h-[100px]"
        />
      </div>
      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold">SUBMIT</button>
    </form>
  );
};

export default MessageForm; 