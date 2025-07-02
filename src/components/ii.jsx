const AddClass = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg relative px-8 pt-8 pb-12">
        {/* Breadcrumb */}
        <div className="absolute top-2 left-8 text-xs text-gray-500">
          Home <span className="mx-1">-</span>
          <span className="text-blue-600 underline cursor-pointer">Add New Class</span>
        </div>
        {/* Window controls */}
        <div className="absolute top-2 right-8 flex gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block border border-gray-300" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block border border-gray-300" />
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-gray-300" />
        </div>
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2 mt-6">Class Information</h2>
        <div className="border-b border-gray-200 mb-8" />
        {/* Form */}
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Teacher's Name</label>
              <input type="text" className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">ID</label>
              <input type="text" className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Class</label>
              <select className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none">
                <option>Please Select Class</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Section</label>
              <select className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none">
                <option>Please Select Section</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Subject</label>
              <select className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none">
                <option></option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Time</label>
              <select className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none">
                <option></option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Date</label>
              <input type="text" placeholder="dd/mm/yyyy" className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none" />
            </div>
            <div></div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow-md text-base tracking-wide">
              SAVE
            </button>
            <button type="reset" className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded shadow-md text-base tracking-wide">
              RESET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClass; 