// data/data.js
import {
  LayoutDashboard,
  FileText,
  Edit,
  List,
  Filter,
  Shield,
  Eye,
  PieChart
} from "lucide-react";

export const menuItems = [
  // === SISTEMA DE COTAÇÕES (PARTE SUPERIOR) ===
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    type: "single",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 2,
    label: "Cotações",
    icon: FileText,
    type: "submenu",
    color: "from-indigo-400 to-purple-400",
    submenu: [
      {
        id: 21,
        label: "Criar Cotação",
        icon: FileText,
        path: "/cotacoes/criar",
        color: "from-green-300 to-emerald-300",
      },
      {
        id: 22,
        label: "Editar Cotação",
        icon: Edit,
        path: "/cotacoes/editar",
        color: "from-yellow-300 to-amber-300",
      },
      {
        id: 23,
        label: "Listar Cotações",
        icon: List,
        path: "/cotacoes/listar",
        color: "from-cyan-300 to-blue-300",
      },
    ],
  },

  // === LINHA DIVISÓRIA - SISTEMA CRM ===
  
  // === MENUS DO SISTEMA CRM (SEM SUBMENUS) ===
  {
    id: 3,
    label: "Gestão de Cotações",
    icon: Filter,
    path: "/crm/gestao-cotacoes",
    type: "single",
    color: "from-green-500 to-emerald-500",
    badge: "45"
  },
  {
    id: 4,
    label: "Subscrição",
    icon: Shield,
    path: "/crm/subscricao",
    type: "single",
    color: "from-indigo-500 to-purple-500",
    badge: "8"
  },
  {
    id: 5,
    label: "Acompanhamento",
    icon: Eye,
    path: "/crm/acompanhamento",
    type: "single",
    color: "from-orange-500 to-red-500",
    badge: "42"
  },
  {
    id: 6,
    label: "Relatórios",
    icon: PieChart,
    path: "/crm/relatorios",
    type: "single",
    color: "from-amber-500 to-orange-500"
  }
];