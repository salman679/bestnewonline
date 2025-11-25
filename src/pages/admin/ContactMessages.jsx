import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axiosInstanace';
import { FaEnvelope, FaTrash, FaSearch, FaFilter, FaSort, FaCheck, FaTimes, FaClock, FaUser, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);


  const fetchMessages = async () => {
    try {
      const response = await axiosInstance('/contact');
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axiosInstance.delete(`/contact/${id}`);
        setMessages(prevMessages => prevMessages.filter(message => message._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setShowDetails(false);
          setSelectedMessage(null);
        }
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === id
            ? { ...message, status: newStatus }
            : message
        )
      );

      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({
          ...prev,
          status: newStatus
        }));
      }

      await axiosInstance.put(`/contact/update/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === id
            ? { ...message, status: selectedMessage.status }
            : message
        )
      );

      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({
          ...prev,
          status: prev.status
        }));
      }

      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredMessages = messages
    .filter(message => {
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || message.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="p-6 max-w-7xl mx-auto max-[640px]:p-2">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-[640px]:p-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Messages</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and respond to contact form submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <FaEnvelope className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 max-[640px]:p-2"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <FaEnvelope className="w-12 h-12 mb-4" />
            <p>No messages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-[640px]:p-2">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {message.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {message.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-900 dark:text-white">{message.subject}</div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <FaClock className="w-4 h-4 mr-2" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${message.status.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      {message.status.toLowerCase() === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(message._id, 'replied');
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Mark as Replied"
                        >
                          <FaCheck className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message._id);
                        }}
                        className="textColor600 hover:text-red-900 dark:textColor dark:hover:text-red-300 transition-colors"
                        title="Delete Message"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>


      {/* Message Details Modal */}
      <AnimatePresence>
        {showDetails && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 max-[640px]:p-2 max-[640px]:mt-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Details
                    </h2>
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        From {selectedMessage.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedMessage(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg max-[640px]:p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <FaPaperPlane className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Subject</h3>
                    </div>
                    <p className="text-gray-900 dark:text-white">{selectedMessage.subject}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaEnvelope className="w-4 h-4 text-green-500" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Message</h3>
                    </div>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaClock className="w-4 h-4" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedMessage.status.toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                        {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                      </span>
                      {selectedMessage.status.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedMessage._id, 'replied')}
                          className="text-sm text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 transition-colors"
                        >
                          <FaCheck className="w-4 h-4" />
                          Mark as Replied
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedMessage(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const email = selectedMessage.email;
                      const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
                      window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${subject}`, "_blank");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactMessages; 