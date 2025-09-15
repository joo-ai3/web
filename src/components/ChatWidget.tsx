import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiX, 
  FiSend, 
  FiUser, 
  FiMinimize2, 
  FiMaximize2,
  FiPaperclip
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { useToast } from '../contexts/ToastContext';

interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'ORDER_INFO' | 'PRODUCT_LINK';
  senderType: 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'AI';
  senderName?: string;
  isFromAI: boolean;
  timestamp: Date;
  attachments?: string[];
  metadata?: any;
}

interface Conversation {
  id: string;
  subject?: string;
  status: 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assignedToId?: string;
  assignedToName?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'AI' | 'HUMAN'>('AI');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { lang } = useLang();
  const { showToast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && !conversation) {
      initializeChat();
    }
  }, [isOpen]);

  // Check for new messages periodically
  useEffect(() => {
    if (conversation) {
      const interval = setInterval(checkForNewMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Check if user has an existing open conversation
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/conversations/current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
        },
        body: JSON.stringify({
          customerName: user?.name,
          customerEmail: user?.email
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setConversation(data.data);
          setMessages(data.data.messages || []);
        } else {
          // Create new conversation
          await createNewConversation();
        }
      } else {
        await createNewConversation();
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      await createNewConversation();
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
        },
        body: JSON.stringify({
          source: 'WEBSITE',
          customerName: user?.name,
          customerEmail: user?.email
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(data.data);
        
        // Send welcome message
        await sendWelcomeMessage();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const sendWelcomeMessage = async () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: lang === 'ar' 
        ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في:\n\n• تتبع طلبك\n• معلومات المنتجات\n• الشحن والتوصيل\n• المرتجعات والاستبدال\n\nأو يمكنك طلب التحدث مع أحد موظفي خدمة العملاء.'
        : 'Hello! How can I help you today? I can assist you with:\n\n• Order tracking\n• Product information\n• Shipping and delivery\n• Returns and exchanges\n\nOr you can request to speak with a human agent.',
      type: 'TEXT',
      senderType: 'AI',
      senderName: 'Soleva Assistant',
      isFromAI: true,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      type: 'TEXT',
      senderType: 'CUSTOMER',
      senderName: user?.name || 'Customer',
      isFromAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: inputMessage.trim(),
          type: 'TEXT'
        })
      });

      if (response.ok) {
        // Handle AI or agent response
        if (chatMode === 'AI') {
          await handleAIResponse(inputMessage.trim());
        } else {
          // Notify agent of new message
          setAgentTyping(true);
          setTimeout(() => setAgentTyping(false), 3000);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast(
        lang === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message'
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      // Check if user is asking for order tracking
      if (isOrderTrackingQuery(userMessage)) {
        await handleOrderTracking(userMessage);
        return;
      }

      // Check if user wants to speak with human
      if (isHumanRequestQuery(userMessage)) {
        await switchToHumanMode();
        return;
      }

      // Generate AI response
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/ai-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: conversation?.id,
          message: userMessage,
          language: lang,
          context: {
            userId: user?.id,
            previousMessages: messages.slice(-5) // Last 5 messages for context
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          content: data.data.response,
          type: 'TEXT',
          senderType: 'AI',
          senderName: 'Soleva Assistant',
          isFromAI: true,
          timestamp: new Date(),
          metadata: {
            confidence: data.data.confidence,
            model: data.data.model
          }
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI response error:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString() + '_fallback',
        content: lang === 'ar'
          ? 'أعتذر، لم أتمكن من فهم استفسارك. هل يمكنك إعادة صياغته أو طلب التحدث مع أحد موظفي خدمة العملاء؟'
          : 'I apologize, I couldn\'t understand your query. Could you please rephrase it or request to speak with a human agent?',
        type: 'TEXT',
        senderType: 'AI',
        senderName: 'Soleva Assistant',
        isFromAI: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const isOrderTrackingQuery = (message: string): boolean => {
    const orderKeywords = {
      ar: ['طلب', 'تتبع', 'رقم', 'وين', 'فين', 'وصل', 'شحن'],
      en: ['order', 'track', 'tracking', 'number', 'where', 'status', 'delivery']
    };
    
    const keywords = orderKeywords[lang as keyof typeof orderKeywords];
    return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  };

  const isHumanRequestQuery = (message: string): boolean => {
    const humanKeywords = {
      ar: ['موظف', 'انسان', 'شخص', 'عميل', 'خدمة', 'مندوب'],
      en: ['human', 'agent', 'person', 'staff', 'representative', 'support']
    };
    
    const keywords = humanKeywords[lang as keyof typeof humanKeywords];
    return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  };

  const handleOrderTracking = async (message: string) => {
    // Extract order number from message
    const orderNumberMatch = message.match(/SOL-\d{8}-\d{5}|#?\d{10,}/);
    
    if (orderNumberMatch) {
      const orderNumber = orderNumberMatch[0];
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/orders/track/${orderNumber}`, {
          headers: user ? {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          } : {}
        });

        if (response.ok) {
          const data = await response.json();
          const order = data.data;
          
          const orderInfoMessage: Message = {
            id: Date.now().toString() + '_order',
            content: formatOrderInfo(order),
            type: 'ORDER_INFO',
            senderType: 'AI',
            senderName: 'Soleva Assistant',
            isFromAI: true,
            timestamp: new Date(),
            metadata: { order }
          };

          setMessages(prev => [...prev, orderInfoMessage]);
        } else {
          const errorMessage: Message = {
            id: Date.now().toString() + '_error',
            content: lang === 'ar'
              ? 'لم أتمكن من العثور على طلب بهذا الرقم. يرجى التأكد من رقم الطلب والمحاولة مرة أخرى.'
              : 'I couldn\'t find an order with that number. Please check the order number and try again.',
            type: 'TEXT',
            senderType: 'AI',
            senderName: 'Soleva Assistant',
            isFromAI: true,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error('Order tracking error:', error);
      }
    } else {
      const askOrderMessage: Message = {
        id: Date.now().toString() + '_ask_order',
        content: lang === 'ar'
          ? 'يرجى تقديم رقم الطلب الخاص بك. يمكنك العثور عليه في بريدك الإلكتروني أو في قسم "طلباتي".'
          : 'Please provide your order number. You can find it in your email or in the "My Orders" section.',
        type: 'TEXT',
        senderType: 'AI',
        senderName: 'Soleva Assistant',
        isFromAI: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, askOrderMessage]);
    }
  };

  const formatOrderInfo = (order: any): string => {
    if (lang === 'ar') {
      return `📦 معلومات الطلب ${order.orderNumber}

الحالة: ${getOrderStatusText(order.orderStatus, 'ar')}
حالة الدفع: ${getPaymentStatusText(order.paymentStatus, 'ar')}
حالة الشحن: ${getShippingStatusText(order.shippingStatus, 'ar')}
الإجمالي: ${order.totalAmount} ج.م

${order.trackingNumber ? `رقم التتبع: ${order.trackingNumber}` : ''}

${order.estimatedDelivery ? `التسليم المتوقع: ${new Date(order.estimatedDelivery).toLocaleDateString('ar-EG')}` : ''}`;
    } else {
      return `📦 Order ${order.orderNumber} Information

Status: ${getOrderStatusText(order.orderStatus, 'en')}
Payment: ${getPaymentStatusText(order.paymentStatus, 'en')}
Shipping: ${getShippingStatusText(order.shippingStatus, 'en')}
Total: ${order.totalAmount} EGP

${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''}

${order.estimatedDelivery ? `Est. Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-US')}` : ''}`;
    }
  };

  const switchToHumanMode = async () => {
    setChatMode('HUMAN');
    
    const switchMessage: Message = {
      id: Date.now().toString() + '_switch',
      content: lang === 'ar'
        ? '🙋‍♀️ تم تحويلك إلى أحد موظفي خدمة العملاء. سيتم الرد عليك في أقرب وقت ممكن.'
        : '🙋‍♀️ You\'ve been connected to a human agent. You\'ll receive a response shortly.',
      type: 'TEXT',
      senderType: 'SYSTEM',
      isFromAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, switchMessage]);

    // Notify admin of new human chat request
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/request-human`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
        },
        body: JSON.stringify({
          conversationId: conversation?.id
        })
      });
    } catch (error) {
      console.error('Failed to request human agent:', error);
    }
  };

  const checkForNewMessages = async () => {
    if (!conversation) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/conversations/${conversation.id}/messages?since=${messages[messages.length - 1]?.timestamp || new Date().toISOString()}`, {
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        } : {}
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setMessages(prev => [...prev, ...data.data]);
          
          // Update unread count if widget is closed
          if (!isOpen) {
            setUnreadCount(prev => prev + data.data.length);
          }
        }
      }
    } catch (error) {
      console.error('Failed to check for new messages:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!conversation) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversation.id);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/v1/chat/upload`, {
        method: 'POST',
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        } : {},
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        const fileMessage: Message = {
          id: Date.now().toString() + '_file',
          content: `📎 ${file.name}`,
          type: 'FILE',
          senderType: 'CUSTOMER',
          senderName: user?.name || 'Customer',
          isFromAI: false,
          timestamp: new Date(),
          attachments: [data.data.url]
        };

        setMessages(prev => [...prev, fileMessage]);
      }
    } catch (error) {
      console.error('File upload error:', error);
      showToast(
        lang === 'ar' ? 'فشل في رفع الملف' : 'Failed to upload file'
      );
    }
  };

  const getOrderStatusText = (status: string, language: 'ar' | 'en') => {
    const statusMap = {
      PENDING: { ar: 'في الانتظار', en: 'Pending' },
      CONFIRMED: { ar: 'مؤكد', en: 'Confirmed' },
      PROCESSING: { ar: 'قيد التحضير', en: 'Processing' },
      SHIPPED: { ar: 'تم الشحن', en: 'Shipped' },
      DELIVERED: { ar: 'تم التسليم', en: 'Delivered' },
      CANCELLED: { ar: 'ملغي', en: 'Cancelled' }
    };
    return statusMap[status as keyof typeof statusMap]?.[language] || status;
  };

  const getPaymentStatusText = (status: string, language: 'ar' | 'en') => {
    const statusMap = {
      PENDING: { ar: 'في الانتظار', en: 'Pending' },
      AWAITING_PROOF: { ar: 'في انتظار إثبات الدفع', en: 'Awaiting Proof' },
      UNDER_REVIEW: { ar: 'قيد المراجعة', en: 'Under Review' },
      PAID: { ar: 'مدفوع', en: 'Paid' },
      FAILED: { ar: 'فشل', en: 'Failed' }
    };
    return statusMap[status as keyof typeof statusMap]?.[language] || status;
  };

  const getShippingStatusText = (status: string, language: 'ar' | 'en') => {
    const statusMap = {
      PENDING: { ar: 'في الانتظار', en: 'Pending' },
      PROCESSING: { ar: 'قيد التحضير', en: 'Processing' },
      SHIPPED: { ar: 'تم الشحن', en: 'Shipped' },
      OUT_FOR_DELIVERY: { ar: 'في الطريق', en: 'Out for Delivery' },
      DELIVERED: { ar: 'تم التسليم', en: 'Delivered' }
    };
    return statusMap[status as keyof typeof statusMap]?.[language] || status;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openChat}
            className="chat-widget-button"
          >
            <FiMessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              height: isMinimized ? 60 : 500
            }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="chat-window"
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  {chatMode === 'AI' ? <FiUser /> : <FiUser />}
                </div>
                <div className="chat-info">
                  <div className="chat-title">
                    {chatMode === 'AI' 
                      ? (lang === 'ar' ? 'مساعد سوليفا' : 'Soleva Assistant')
                      : (lang === 'ar' ? 'خدمة العملاء' : 'Customer Support')
                    }
                  </div>
                  <div className="chat-status">
                    {agentTyping ? (
                      <span className="typing-indicator">
                        {lang === 'ar' ? 'يكتب...' : 'Typing...'}
                      </span>
                    ) : (
                      <span className="online-status">
                        {lang === 'ar' ? 'متاح الآن' : 'Online now'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="chat-actions">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="chat-action-button"
                >
                  {isMinimized ? <FiMaximize2 size={16} /> : <FiMinimize2 size={16} />}
                </button>
                <button
                  onClick={closeChat}
                  className="chat-action-button"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="chat-content"
                >
                  {/* Messages */}
                  <div className="messages-container">
                    {loading ? (
                      <div className="loading-messages">
                        <div className="loading-spinner"></div>
                        <span>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message ${message.senderType === 'CUSTOMER' ? 'user' : 'bot'}`}
                        >
                          <div className="message-avatar">
                            {message.senderType === 'CUSTOMER' ? (
                              <FiUser />
                            ) : message.isFromAI ? (
                              <FiUser />
                            ) : (
                              <FiUser />
                            )}
                          </div>
                          
                          <div className="message-content">
                            <div className="message-header">
                              <span className="sender-name">
                                {message.senderName || 
                                  (message.senderType === 'CUSTOMER' 
                                    ? (lang === 'ar' ? 'أنت' : 'You')
                                    : (lang === 'ar' ? 'المساعد' : 'Assistant')
                                  )
                                }
                              </span>
                              <span className="message-time">
                                {message.timestamp.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <div className="message-text">
                              {message.content}
                            </div>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="message-attachments">
                                {message.attachments.map((attachment, index) => (
                                  <a 
                                    key={index}
                                    href={attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="attachment-link"
                                  >
                                    <FiPaperclip size={14} />
                                    {lang === 'ar' ? 'مرفق' : 'Attachment'}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isTyping && (
                      <div className="message bot">
                        <div className="message-avatar">
                          <FiUser />
                        </div>
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                        className="chat-input"
                        disabled={loading}
                      />
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="chat-attach-button"
                        disabled={loading}
                      >
                        <FiPaperclip size={18} />
                      </button>
                      
                      <button
                        onClick={sendMessage}
                        className="chat-send-button"
                        disabled={!inputMessage.trim() || loading}
                      >
                        <FiSend size={18} />
                      </button>
                    </div>
                    
                    {chatMode === 'AI' && (
                      <div className="chat-mode-switch">
                        <button
                          onClick={switchToHumanMode}
                          className="human-request-button"
                        >
                          {lang === 'ar' ? '🙋‍♀️ تحدث مع موظف' : '🙋‍♀️ Talk to human'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .chat-widget-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #d1b16a 0%, #b8965a 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(209, 177, 106, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(209, 177, 106, 0.6);
        }

        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .chat-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 400px;
          background: var(--glass-bg);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          border: 1px solid var(--border-secondary);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 32px);
            right: 16px;
            left: 16px;
          }
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #d1b16a 0%, #b8965a 100%);
          color: white;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
        }

        .chat-title {
          font-weight: 600;
          font-size: 16px;
        }

        .chat-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .typing-indicator {
          color: #10b981;
        }

        .online-status {
          color: rgba(255, 255, 255, 0.8);
        }

        .chat-actions {
          display: flex;
          gap: 8px;
        }

        .chat-action-button {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .chat-action-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chat-content {
          display: flex;
          flex-direction: column;
          height: 440px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .loading-messages {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          height: 200px;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border-primary);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .message {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message.user .message-content {
          background: var(--primary);
          color: #000;
          margin-left: 40px;
        }

        .message.bot .message-content {
          background: var(--glass-bg);
          border: 1px solid var(--border-secondary);
          margin-right: 40px;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: var(--primary-100);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--primary);
        }

        .message.user .message-avatar {
          background: var(--primary);
          color: white;
        }

        .message-content {
          max-width: 280px;
          padding: 12px 16px;
          border-radius: 16px;
          word-wrap: break-word;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .sender-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .message.user .sender-name {
          color: rgba(0, 0, 0, 0.8);
        }

        .message-time {
          opacity: 0.6;
          font-size: 11px;
        }

        .message-text {
          line-height: 1.4;
          white-space: pre-wrap;
        }

        .message-attachments {
          margin-top: 8px;
        }

        .attachment-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          text-decoration: none;
          color: inherit;
          font-size: 12px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        .chat-input-container {
          padding: 16px;
          border-top: 1px solid var(--border-secondary);
          background: var(--bg-primary);
        }

        .chat-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid var(--border-primary);
          border-radius: 24px;
          background: var(--glass-bg);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--primary);
        }

        .chat-attach-button,
        .chat-send-button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: var(--primary-100);
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .chat-send-button {
          background: var(--primary);
          color: white;
        }

        .chat-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-attach-button:hover {
          background: var(--primary-200);
        }

        .chat-send-button:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: scale(1.05);
        }

        .chat-mode-switch {
          margin-top: 8px;
          text-align: center;
        }

        .human-request-button {
          background: none;
          border: 1px solid var(--border-primary);
          border-radius: 16px;
          padding: 6px 12px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .human-request-button:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        /* Dark theme adjustments */
        [data-theme="dark"] .chat-window {
          background: rgba(10, 10, 10, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .chat-input-container {
          background: rgba(10, 10, 10, 0.8);
        }

        [data-theme="dark"] .message.bot .message-content {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
