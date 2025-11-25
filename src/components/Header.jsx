import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  Sun,
  Moon,
  User,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  BarChart3,
  Users,
  Activity,
  LogOut,
  UserCog,
  Database,
  ShieldCheck,
} from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("pt");
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const settingsRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dados do Sistema CRM - Imperial Seguros
  const notifications = [
    { 
      id: 1, 
      text: "Nova cotação aprovada - Aguardando emissão de apólice", 
      time: "2 min atrás", 
      unread: true,
      type: "approval",
      priority: "high"
    },
    { 
      id: 2, 
      text: "Cotação #CT-2345 expira em 2 dias", 
      time: "15 min atrás", 
      unread: true,
      type: "expiry",
      priority: "medium"
    },
    {
      id: 3,
      text: "3 novas cotações criadas hoje",
      time: "1 hora atrás",
      unread: false,
      type: "achievement",
      priority: "low"
    },
    {
      id: 4,
      text: "Relatório mensal gerado com sucesso",
      time: "2 horas atrás",
      unread: false,
      type: "system",
      priority: "low"
    }
  ];

  const messages = [
    {
      id: 1,
      text: "Subscritor: Nova apólice emitida #AP-6789",
      time: "5 min atrás",
      unread: true,
      type: "policy",
      priority: "high"
    },
    { 
      id: 2, 
      text: "Agente pediu revisão de permissões", 
      time: "30 min atrás", 
      unread: true,
      type: "admin",
      priority: "medium"
    },
    {
      id: 3,
      text: "Backup do sistema realizado com sucesso",
      time: "2 horas atrás",
      unread: false,
      type: "system",
      priority: "low"
    }
  ];

  // Métricas do CRM para Administrador
  const crmMetrics = {
    totalQuotes: 156,
    pendingApproval: 23,
    policiesIssued: 89,
    activeAgents: 12,
    conversionRate: "68%",
    revenue: "MT 2.4M"
  };

  // Dados de idiomas - Agora com siglas visíveis
  const languages = [
    { code: "pt", name: "Português", flag: "🇵🇹", shortName: "PT" },
    { code: "en", name: "English", flag: "🇺🇸", shortName: "EN" },
    { code: "fr", name: "Français", flag: "🇫🇷", shortName: "FR" }
  ];

  const unreadNotifications = notifications.filter((n) => n.unread).length;
  const unreadMessages = messages.filter((m) => m.unread).length;

  // Função para obter ícone baseado no tipo
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expiry': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'achievement': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'policy': return <FileText className="h-4 w-4 text-emerald-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'system': return <Activity className="h-4 w-4 text-cyan-500" />;
      default: return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  // Função para obter cor de prioridade
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'rgba(239, 68, 68, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'low': return 'rgba(74, 222, 128, 0.05)';
      default: return 'rgba(74, 222, 128, 0.05)';
    }
  };

  // Função de pesquisa
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Pesquisando por:", searchQuery);
      // Aqui você implementaria a lógica de pesquisa real
      alert(`Pesquisando por: ${searchQuery}`);
    }
  };

  // Função para lidar com Enter na pesquisa
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Função para mudar idioma
  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsSettingsOpen(false);
    console.log("Idioma alterado para:", langCode);
  };

  // Função para obter texto baseado no idioma
  const getText = (pt, en, fr) => {
    switch (language) {
      case 'pt': return pt;
      case 'en': return en;
      case 'fr': return fr;
      default: return pt;
    }
  };

  // Função para alternar o tema
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    console.log("Modo escuro:", !darkMode);
  };

  return (
    <header 
      className="sticky top-0 z-40 backdrop-blur-2xl border-b shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0f0f0f 100%)',
        borderColor: 'rgba(74, 222, 128, 0.15)'
      }}
    >
      <div className="px-6 py-4">
        {/* Primeira Linha: Navegação e Ações */}
        <div className="flex items-center justify-between mb-4">
          {/* Lado Esquerdo: Navegação */}
          <div className="flex items-center space-x-6">
            {/* Botão Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.2)'
              }}
            >
              <Menu className="h-5 w-5 transition-colors duration-300 group-hover:text-emerald-300" style={{ color: '#a7f3d0' }} />
            </button>

            {/* Navegação */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm" 
                style={{ 
                  background: 'rgba(74, 222, 128, 0.1)',
                  color: '#86efac',
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}>
                CRM Imperial
              </span>
              <span style={{ color: 'rgba(74, 222, 128, 0.3)' }}>•</span>
              <span className="text-sm font-semibold text-white">
                {getText("Painel Administrativo", "Admin Dashboard", "Tableau de Bord Admin")}
              </span>
            </div>

            {/* Barra de Pesquisa Dinâmica - SEM LINHA VERDE */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4" style={{ color: 'rgba(134, 239, 172, 0.6)' }} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getText(
                  "Pesquisar cotações, apólices, agentes...",
                  "Search quotes, policies, agents...",
                  "Rechercher devis, polices, agents..."
                )}
                className="pl-10 pr-12 py-2.5 w-80 rounded-xl focus:ring-2 transition-all duration-300 placeholder-opacity-60 backdrop-blur-sm text-sm"
                style={{
                  background: 'rgba(74, 222, 128, 0.05)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  color: '#ffffff',
                  focusRing: 'rgba(74, 222, 128, 0.5)',
                  placeholderColor: 'rgba(134, 239, 172, 0.6)'
                }}
              />
              {/* Botão de Pesquisa Dinâmico */}
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-300 ${
                  searchQuery.trim() 
                    ? 'text-emerald-400 hover:text-emerald-300 cursor-pointer' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <Search className="h-4 w-4" />
              </button>
              
              {/* REMOVIDA: Linha verde que aparecia durante a pesquisa */}
            </div>
          </div>

          {/* Lado Direito: Ações Rápidas */}
          <div className="flex items-center space-x-3">
            {/* Toggle Tema Funcional - AGORA FUNCIONA AO CLICAR */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.2)'
              }}
              title={darkMode ? 
                getText("Modo Claro", "Light Mode", "Mode Clair") : 
                getText("Modo Escuro", "Dark Mode", "Mode Sombre")
              }
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
              ) : (
                <Moon className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
              )}
            </button>

            {/* Mensagens */}
            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen);
                  setIsNotificationsOpen(false);
                  setIsSettingsOpen(false);
                }}
                className="relative p-2 rounded-xl transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}
              >
                <MessageSquare className="h-5 w-5 transition-colors duration-300 group-hover:text-cyan-300" style={{ color: '#86efac' }} />
                {unreadMessages > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center animate-pulse font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white'
                    }}
                  >
                    {unreadMessages}
                  </span>
                )}
              </button>

              {/* Dropdown Mensagens */}
              {isMessagesOpen && (
                <div 
                  className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl backdrop-blur-xl z-50 animate-slideDown"
                  style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-base">
                        {getText("Mensagens do Sistema", "System Messages", "Messages du Système")}
                      </h3>
                      <span className="text-sm px-2 py-1 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#86efac' }}>
                        {unreadMessages} {getText("não lidas", "unread", "non lues")}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border-b transition-all duration-200 hover:bg-opacity-20 ${
                          message.unread ? "border-l-4" : ""
                        }`}
                        style={{ 
                          borderColor: 'rgba(74, 222, 128, 0.1)',
                          borderLeftColor: message.unread ? '#4ade80' : 'transparent',
                          background: message.unread ? getPriorityColor(message.priority) : 'transparent'
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(message.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white leading-tight">
                              {message.text}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                              {message.time}
                            </p>
                          </div>
                          {message.unread && (
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <button 
                      className="w-full text-center text-sm font-medium py-2 rounded-lg transition-all duration-200 hover:bg-opacity-20"
                      style={{
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.1)'
                      }}
                    >
                      {getText("Ver Todas as Mensagens", "View All Messages", "Voir Tous les Messages")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsMessagesOpen(false);
                  setIsSettingsOpen(false);
                }}
                className="relative p-2 rounded-xl transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}
              >
                <Bell className="h-5 w-5 transition-colors duration-300 group-hover:text-cyan-300" style={{ color: '#86efac' }} />
                {unreadNotifications > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center animate-pulse font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white'
                    }}
                  >
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Dropdown Notificações */}
              {isNotificationsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl backdrop-blur-xl z-50 animate-slideDown"
                  style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-base">
                        {getText("Notificações CRM", "CRM Notifications", "Notifications CRM")}
                      </h3>
                      <span className="text-sm px-2 py-1 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#86efac' }}>
                        {unreadNotifications} {getText("não lidas", "unread", "non lues")}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b transition-all duration-200 hover:bg-opacity-20 ${
                          notification.unread ? "border-l-4" : ""
                        }`}
                        style={{ 
                          borderColor: 'rgba(74, 222, 128, 0.1)',
                          borderLeftColor: notification.unread ? '#4ade80' : 'transparent',
                          background: notification.unread ? getPriorityColor(notification.priority) : 'transparent'
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white leading-tight">
                              {notification.text}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <button 
                      className="w-full text-center text-sm font-medium py-2 rounded-lg transition-all duration-200 hover:bg-opacity-20"
                      style={{
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.1)'
                      }}
                    >
                      {getText("Ver Todas as Notificações", "View All Notifications", "Voir Toutes les Notifications")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Configurações com Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsMessagesOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="p-2 rounded-xl transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}
              >
                <Settings className="h-5 w-5 transition-colors duration-300 group-hover:text-cyan-300" style={{ color: '#86efac' }} />
              </button>

              {/* Dropdown Configurações */}
              {isSettingsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl backdrop-blur-xl z-50 animate-slideDown"
                  style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <h3 className="font-semibold text-white text-base">
                      {getText("Configurações", "Settings", "Paramètres")}
                    </h3>
                  </div>

                  <div className="p-2">
                    {/* Idioma */}
                    <div className="mb-2">
                      <p className="text-xs font-medium px-3 mb-2" style={{ color: '#86efac' }}>
                        {getText("Idioma", "Language", "Langue")}
                      </p>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-all duration-200 mb-1 ${
                            language === lang.code 
                              ? 'bg-emerald-500/20 border border-emerald-500/30' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <span className="text-base" style={{ filter: 'brightness(1.2)' }}>{lang.flag}</span>
                          <span className="text-sm text-white flex-1">{lang.name}</span>
                          <span className="text-xs px-2 py-1 rounded font-medium" 
                            style={{ 
                              background: 'rgba(74, 222, 128, 0.2)', 
                              color: '#86efac',
                              border: '1px solid rgba(74, 222, 128, 0.3)'
                            }}>
                            {lang.shortName}
                          </span>
                          {language === lang.code && (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t my-2" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}></div>

                    {/* Outras Configurações */}
                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <UserCog className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Preferências", "Preferences", "Préférences")}
                      </span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <Database className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Backup & Restauro", "Backup & Restore", "Sauvegarde & Restauration")}
                      </span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <ShieldCheck className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Segurança", "Security", "Sécurité")}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do Administrador */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsSettingsOpen(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 group backdrop-blur-sm"
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}
              >
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-emerald-500/25"
                  style={{
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)'
                  }}
                >
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-white leading-tight">
                    Elton Matsinhe
                  </p>
                  <p className="text-xs" style={{ color: '#86efac' }}>
                    {getText("Administrador", "Administrator", "Administrateur")}
                  </p>
                </div>
              </button>

              {/* Dropdown Perfil */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl backdrop-blur-xl z-50 animate-slideDown"
                  style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #4ade80, #22c55e)'
                        }}
                      >
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          Elton Matsinhe
                        </p>
                        <p className="text-xs" style={{ color: '#86efac' }}>
                          {getText("Administrador do Sistema", "System Administrator", "Administrateur Système")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <User className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Meu Perfil", "My Profile", "Mon Profil")}
                      </span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <Settings className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Configurações", "Settings", "Paramètres")}
                      </span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-white/5 group">
                      <BarChart3 className="h-4 w-4" style={{ color: '#86efac' }} />
                      <span className="text-sm text-white group-hover:text-emerald-300">
                        {getText("Relatórios", "Reports", "Rapports")}
                      </span>
                    </button>

                    <div className="border-t my-2" style={{ borderColor: 'rgba(74, 222, 128, 0.1)' }}></div>

                    <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 hover:bg-red-500/10 group">
                      <LogOut className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-white group-hover:text-red-400">
                        {getText("Terminar Sessão", "Logout", "Déconnexion")}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Segunda Linha: Saudação e Métricas */}
        <div className="flex items-center justify-between">
          {/* Saudação */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getText("Olá, Administrador! 👋", "Hello, Administrator! 👋", "Bonjour, Administrateur! 👋")}
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#86efac' }}>
              {getText(
                "Aqui está o resumo do desempenho do sistema hoje",
                "Here's today's system performance summary", 
                "Voici le résumé des performances du sistema aujourd'hui"
              )}
            </p>
          </div>

          {/* Métricas Rápidas */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" style={{ color: '#4ade80' }} />
                <span className="text-sm font-semibold text-white">{crmMetrics.totalQuotes}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                {getText("Cotações", "Quotes", "Devis")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">{crmMetrics.pendingApproval}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                {getText("Pendentes", "Pending", "En Attente")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-white">{crmMetrics.policiesIssued}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                {getText("Apólices", "Policies", "Polices")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">{crmMetrics.activeAgents}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                {getText("Agentes", "Agents", "Agents")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">{crmMetrics.conversionRate}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                {getText("Conversão", "Conversion", "Conversion")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;