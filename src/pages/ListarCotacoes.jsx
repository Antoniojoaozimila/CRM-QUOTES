// src/pages/ListarCotacoes.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Send,
  Share2,
  Printer,
  Mail,
} from "lucide-react";
import CotacoesLayout from "../components/CotacoesLayout";
import { jsPDF } from "jspdf";

function ListarCotacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [cotacoes, setCotacoes] = useState([]);
  const [cotacaoSelecionada, setCotacaoSelecionada] = useState(null);
  const [mostrarOpcoesPartilha, setMostrarOpcoesPartilha] = useState(false);
  const [processandoEmail, setProcessandoEmail] = useState(false);

  // Carregar cotações do localStorage
  useEffect(() => {
    const cotacoesSalvas = localStorage.getItem("cotacoes");
    if (cotacoesSalvas) {
      setCotacoes(JSON.parse(cotacoesSalvas));
    }
  }, []);

  const filteredCotações = cotacoes.filter((cotacao) => {
    const matchesSearch =
      cotacao.cliente.primeiroNome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cotacao.cliente.sobrenome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cotacao.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || cotacao.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "ativa":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "expirada":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "cancelada":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ativa":
        return "Ativa";
      case "expirada":
        return "Expirada";
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  // Função para gerar PDF profissional
  const gerarPDF = (cotacao) => {
    const doc = new jsPDF();

    // Configurações iniciais
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Função para adicionar nova página se necessário
    const checkPageBreak = (heightNeeded) => {
      if (yPosition + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Cabeçalho com design profissional
    doc.setFillColor(22, 101, 52);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IMPERIAL SEGUROS", margin, 25);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text("Relatório de Cotação", margin, 32);

    yPosition = 50;

    // Título
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.text("DETALHES DA COTAÇÃO", margin, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Nº: ${cotacao.id} | Emitida em: ${new Date(
        cotacao.dataCriacao
      ).toLocaleDateString("pt-MZ")}`,
      margin,
      yPosition
    );

    // Informações do Segurado
    yPosition += 15;
    checkPageBreak(30);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("INFORMAÇÕES DO SEGURADO", margin + 2, yPosition + 6);

    yPosition += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const infoCliente = [
      `Nome: ${cotacao.cliente.tituloContato || ""} ${
        cotacao.cliente.primeiroNome
      } ${cotacao.cliente.sobrenome}`,
      `Email: ${cotacao.cliente.email}`,
      `Telefone: ${cotacao.cliente.telefone}`,
      `Documento: ${cotacao.cliente.numeroDocumento}`,
      `Tipo: ${
        cotacao.cliente.tipo === "Particular"
          ? "Cliente Particular"
          : "Cliente Empresarial"
      }`,
      `Status: ${getStatusText(cotacao.status)}`,
    ];

    infoCliente.forEach((info) => {
      doc.text(info, margin, yPosition);
      yPosition += lineHeight;
    });

    // Detalhes Financeiros
    yPosition += 10;
    checkPageBreak(20);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("DETALHES FINANCEIROS", margin + 2, yPosition + 6);

    yPosition += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Total do Prémio: MT ${parseFloat(cotacao.totalPremio).toLocaleString(
        "pt-MZ",
        { minimumFractionDigits: 2 }
      )}`,
      margin,
      yPosition
    );

    // Veículos
    cotacao.veiculos.forEach((veiculo, index) => {
      yPosition += 15;
      checkPageBreak(50);

      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, 170, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text(`VIATURA ${index + 1}`, margin + 2, yPosition + 6);

      yPosition += 15;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      const infoVeiculo = [
        `Marca/Modelo: ${veiculo.marcaModelo}`,
        `Matrícula: ${veiculo.matricula || "Por atribuir"}`,
        `Tipo: ${veiculo.tipoViatura}`,
        `Capital Seguro: MT ${parseFloat(veiculo.capitalSeguro).toLocaleString(
          "pt-MZ"
        )}`,
        `Prémio: MT ${parseFloat(veiculo.premioAnnual).toLocaleString("pt-MZ", {
          minimumFractionDigits: 2,
        })}`,
      ];

      infoVeiculo.forEach((info) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(info, margin, yPosition);
        yPosition += lineHeight;
      });
    });

    // Rodapé
    const ultimaPagina = doc.internal.getNumberOfPages();
    doc.setPage(ultimaPagina);

    yPosition = pageHeight - 30;
    doc.setFillColor(22, 101, 52);
    doc.rect(0, yPosition, 210, 30, "F");

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Imperial Seguros Moçambique, S.A. | www.imperialinsurance-mz.com",
      margin,
      yPosition + 8
    );
    doc.text(
      `Documento gerado em ${new Date().toLocaleString("pt-MZ")}`,
      margin,
      yPosition + 16
    );

    doc.save(`cotacao-${cotacao.id}.pdf`);
  };

  // Função para visualizar PDF
  const visualizarPDF = (cotacao) => {
    gerarPDF(cotacao);
  };

  // Função para imprimir
  const imprimirCotacao = (cotacao) => {
    const conteudo = `
      <html>
        <head>
          <title>Cotacao ${cotacao.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #166534; padding-bottom: 20px; }
            .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f5f5f5; }
            .total { font-weight: bold; font-size: 1.2em; color: #2d3748; background-color: #e2e8f0; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Imperial Seguros</h1>
            <h2>RELATÓRIO DE COTAÇÃO</h2>
            <p><strong>Nº:</strong> ${
              cotacao.id
            } | <strong>Data:</strong> ${new Date(
      cotacao.dataCriacao
    ).toLocaleDateString("pt-MZ")}</p>
          </div>
          
          <div class="section">
            <h3>INFORMAÇÕES DO CLIENTE</h3>
            <p><strong>Nome:</strong> ${cotacao.cliente.primeiroNome} ${
      cotacao.cliente.sobrenome
    }</p>
            <p><strong>Email:</strong> ${cotacao.cliente.email}</p>
            <p><strong>Telefone:</strong> ${cotacao.cliente.telefone}</p>
            <p><strong>Status:</strong> ${getStatusText(cotacao.status)}</p>
          </div>

          <div class="section">
            <h3>DETALHES FINANCEIROS</h3>
            <table class="table">
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
              <tr>
                <td>Total do Prémio</td>
                <td>MT ${parseFloat(cotacao.totalPremio).toLocaleString(
                  "pt-MZ",
                  { minimumFractionDigits: 2 }
                )}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h3>VEÍCULOS SEGURADOS</h3>
            ${cotacao.veiculos
              .map(
                (veiculo, index) => `
              <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd;">
                <h4>Viatura ${index + 1}: ${veiculo.marcaModelo}</h4>
                <p><strong>Matrícula:</strong> ${veiculo.matricula || "N/A"}</p>
                <p><strong>Tipo:</strong> ${veiculo.tipoViatura}</p>
                <p><strong>Capital Seguro:</strong> MT ${parseFloat(
                  veiculo.capitalSeguro
                ).toLocaleString("pt-MZ")}</p>
                <p><strong>Prémio:</strong> MT ${parseFloat(
                  veiculo.premioAnnual
                ).toLocaleString("pt-MZ", { minimumFractionDigits: 2 })}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `;

    const janela = window.open("", "_blank");
    janela.document.write(conteudo);
    janela.document.close();
    janela.print();
  };

  // Função para enviar email
  const enviarEmail = async (cotacao) => {
    try {
      setProcessandoEmail(true);

      // Simulação de dados para email
      const dadosEmail = {
        Nome_Usuario: `${cotacao.cliente.primeiroNome} ${cotacao.cliente.sobrenome}`,
        Nome_Documento: `Cotação ${cotacao.id}`,
        Nome_Categoria: "Seguro Auto",
        Nome_Departamento: "Comercial",
        Estado: getStatusText(cotacao.status),
        Data_Pedido: new Date(cotacao.dataCriacao).toLocaleDateString("pt-MZ"),
      };

      const mensagem = `Cotação consultada através do sistema de Gestão de Seguros:\n\n
Usuário: ${dadosEmail.Nome_Usuario}\n
Documento: ${dadosEmail.Nome_Documento}\n
Categoria: ${dadosEmail.Nome_Categoria}\n
Departamento: ${dadosEmail.Nome_Departamento}\n\n
Estado: ${dadosEmail.Estado}\n
Data da Cotação: ${dadosEmail.Data_Pedido}\n
Valor Total: MT ${parseFloat(cotacao.totalPremio).toLocaleString("pt-MZ", {
        minimumFractionDigits: 2,
      })}\n\n
Acesse o sistema para mais detalhes. http://192.168.110.71/IMPERIAL-INSURANCE/PortalOnline/login/`;

      // Simulação de envio de email
      console.log("Enviando email para administradores...");
      console.log("Mensagem:", mensagem);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `Relatório da cotação ${cotacao.id} enviado por email para administradores!`
      );
      setMostrarOpcoesPartilha(false);
    } catch (error) {
      alert("Erro ao enviar email. Tente novamente.");
    } finally {
      setProcessandoEmail(false);
    }
  };

  const abrirOpcoesPartilha = (cotacao) => {
    setCotacaoSelecionada(cotacao);
    setMostrarOpcoesPartilha(true);
  };

  return (
    <CotacoesLayout
      title="Listar Cotações"
      subtitle="Visualize e gerencie todas as cotações do sistema"
    >
      <div className="p-8">
        {/* Filtros e Busca */}
        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente ou ID..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="ativa">Ativas</option>
                <option value="expirada">Expiradas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de Cotações */}
        <div className="bg-gray-700/30 rounded-xl border border-gray-600/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-600/20 border-b border-gray-600/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Veículos
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Valor Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/30">
                {filteredCotações.map((cotacao) => (
                  <tr
                    key={cotacao.id}
                    className="hover:bg-gray-600/10 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-green-400 font-semibold">
                        {cotacao.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {cotacao.cliente.primeiroNome}{" "}
                        {cotacao.cliente.sobrenome}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {cotacao.cliente.tipo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">
                        {cotacao.cliente.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {cotacao.veiculos.length} veículo(s)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">
                        MT{" "}
                        {parseFloat(cotacao.totalPremio).toLocaleString(
                          "pt-MZ",
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {new Date(cotacao.dataCriacao).toLocaleDateString(
                          "pt-MZ"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          cotacao.status
                        )}`}
                      >
                        {getStatusText(cotacao.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors duration-200"
                          title="Visualizar"
                          onClick={() => visualizarPDF(cotacao)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors duration-200"
                          title="Download PDF"
                          onClick={() => gerarPDF(cotacao)}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors duration-200"
                          title="Mais opções"
                          onClick={() => abrirOpcoesPartilha(cotacao)}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé da Tabela */}
          <div className="px-6 py-4 bg-gray-600/20 border-t border-gray-600/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Mostrando {filteredCotações.length} de {cotacoes.length}{" "}
                cotações
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-600/50 text-gray-300 rounded hover:bg-gray-600 transition-colors duration-200">
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Partilha */}
        {mostrarOpcoesPartilha && cotacaoSelecionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Partilhar Cotação
                </h3>
                <button
                  onClick={() => setMostrarOpcoesPartilha(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="text-white font-semibold">
                    Cotação: {cotacaoSelecionada.id}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Cliente: {cotacaoSelecionada.cliente.primeiroNome}{" "}
                    {cotacaoSelecionada.cliente.sobrenome}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Total: MT{" "}
                    {parseFloat(cotacaoSelecionada.totalPremio).toLocaleString(
                      "pt-MZ",
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => gerarPDF(cotacaoSelecionada)}
                    className="p-4 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center gap-2"
                  >
                    <Download className="h-6 w-6" />
                    <span className="font-semibold">Download</span>
                    <span className="text-xs text-gray-400">Baixar PDF</span>
                  </button>

                  <button
                    onClick={() => imprimirCotacao(cotacaoSelecionada)}
                    className="p-4 rounded-lg border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center gap-2"
                  >
                    <Printer className="h-6 w-6" />
                    <span className="font-semibold">Imprimir</span>
                    <span className="text-xs text-gray-400">Imprimir</span>
                  </button>

                  <button
                    onClick={() => visualizarPDF(cotacaoSelecionada)}
                    className="p-4 rounded-lg border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center gap-2"
                  >
                    <Eye className="h-6 w-6" />
                    <span className="font-semibold">Visualizar</span>
                    <span className="text-xs text-gray-400">Ver PDF</span>
                  </button>

                  <button
                    onClick={() => enviarEmail(cotacaoSelecionada)}
                    disabled={processandoEmail}
                    className="p-4 rounded-lg border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processandoEmail ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    ) : (
                      <Send className="h-6 w-6" />
                    )}
                    <span className="font-semibold">
                      {processandoEmail ? "Enviando..." : "Enviar Email"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Para administradores
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setMostrarOpcoesPartilha(false)}
                  className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CotacoesLayout>
  );
}

export default ListarCotacoes;
