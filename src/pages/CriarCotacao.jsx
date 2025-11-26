import React, { useState, useEffect } from "react";
import {
  Save,
  User,
  Building,
  ChevronDown,
  Calendar,
  Phone,
  FileText,
  Globe,
  Mail,
  Car,
  Shield,
  Calculator,
  DollarSign,
  Type,
  Hash,
  Calendar as CalendarIcon,
  Cog,
  Barcode,
  Users,
  Percent,
  CreditCard,
  Smartphone,
  Wallet,
  Download,
  Share2,
  Send,
  X,
  Printer,
  Eye,
} from "lucide-react";
import { jsPDF } from "jspdf";

function CriarCliente() {
  const [tipoCliente, setTipoCliente] = useState("Particular");
  const [isSwitching, setIsSwitching] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [mostrarOpcoesPartilha, setMostrarOpcoesPartilha] = useState(false);
  const [cotacaoGerada, setCotacaoGerada] = useState(null);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  // Estados para o formulário da viatura
  const [tipoCobertura, setTipoCobertura] = useState("");
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoAtual, setVeiculoAtual] = useState({
    marcaModelo: "",
    matricula: "",
    ano: "",
    motor: "",
    chassis: "",
    lotacao: "",
    tipoViatura: "",
    capitalSeguro: "",
    taxa: "",
    taxaSelecionada: "",
    premioAnnual: "",
  });

  // Estados para pagamento
  const [formaPagamento, setFormaPagamento] = useState("");
  const [contactoMPesa, setContactoMPesa] = useState("");
  const [contactoEMola, setContactoEMola] = useState("");
  const [pinPagamento, setPinPagamento] = useState("");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  const [formData, setFormData] = useState({
    nacionalidade: "MZ",
    tituloContato: "",
    primeiroNome: "",
    sobrenome: "",
    telefone: "+258",
    email: "",
    numeroDocumento: "",
    dataNascimento: "",
    nomeEmpresa: "",
    numeroReferenciaFiscal: "",
  });

  // Array temporário para persistir cotações
  const [cotacoesSalvas, setCotacoesSalvas] = useState([]);

  // Configurações das coberturas baseadas no Excel
  const configCoberturas = {
    DP_NORMAL: {
      nome: "DP NORMAL - Danos Próprios com Franquia",
      taxas: {
        Ligeiro: 0.035,
        Pesado: 0.05,
      },
      taxasOpcoes: {
        Ligeiro: [0.035, 0.04, 0.045],
        Pesado: [0.05, 0.055, 0.06, 0.065],
      },
      premioMinimo: {
        Ligeiro: 12000,
        Pesado: 15000,
      },
      coberturas: {
        responsabilidadeCivil: 5000000,
        morteInvalidez: 100000,
        despesasMedicas: 20000,
        despesasFuneral: 5000,
        perdaChaves: 35000,
        remocaoSalvados: 52500,
      },
    },
    DP_SEM_FRANQUIA: {
      nome: "DP SEM FRANQUIA - Danos Próprios sem Franquia",
      taxas: {
        Ligeiro: 0.035,
        Pesado: 0.05,
      },
      taxasOpcoes: {
        Ligeiro: [0.035, 0.04, 0.045],
        Pesado: [0.05, 0.055, 0.06, 0.065],
      },
      premioMinimo: {
        Ligeiro: 12000,
        Pesado: 15000,
      },
      coberturas: {
        responsabilidadeCivil: 10000000,
        morteInvalidez: 250000,
        despesasMedicas: 85000,
        despesasFuneral: 25000,
        perdaChaves: 55000,
        remocaoSalvados: 65000,
      },
    },
    RC_NORMAL: {
      nome: "RC NORMAL - Apenas Responsabilidade Civil",
      taxas: {
        Ligeiro: 0.045,
        Pesado: 0.05,
      },
      taxasOpcoes: {
        Ligeiro: [0.045, 0.05, 0.055],
        Pesado: [0.05, 0.055, 0.06, 0.065],
      },
      premioMinimo: {
        Ligeiro: 2999,
        Pesado: 5999,
      },
      coberturas: {
        responsabilidadeCivil: 4000000,
        morteInvalidez: 0,
        despesasMedicas: 0,
        despesasFuneral: 0,
      },
    },
    RC_OCUPANTES: {
      nome: "RC & OCUPANTES - RC + Cobertura para Ocupantes",
      taxas: {
        Ligeiro: 0.035,
        Pesado: 0.05,
      },
      taxasOpcoes: {
        Ligeiro: [0.035, 0.04, 0.045],
        Pesado: [0.05, 0.055, 0.06, 0.065],
      },
      premioMinimo: {
        Ligeiro: 3500,
        Pesado: 8000,
      },
      coberturas: {
        responsabilidadeCivil: 4000000,
        morteInvalidez: 100000,
        despesasMedicas: 20000,
        despesasFuneral: 5000,
      },
    },
  };

  const titulosContato = ["Sr.", "Sra.", "Dr.", "Dra.", "Eng.", "Arq."];

  const paises = [
    { code: "MZ", name: "Moçambique", flag: "🇲🇿" },
    { code: "AO", name: "Angola", flag: "🇦🇴" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "BR", name: "Brasil", flag: "🇧🇷" },
    { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  ];

  // Função para enviar email - CORRIGIDA
  const enviarEmailCotacao = async (cotacao) => {
    try {
      setEnviandoEmail(true);

      const dadosCotacao = {
        Nome_Usuario: `${cotacao.cliente.primeiroNome} ${cotacao.cliente.sobrenome}`,
        Nome_Documento: `Cotação ${cotacao.id}`,
        Nome_Categoria: tipoCobertura,
        Nome_Departamento: "Seguros Auto",
        Estado: "Ativa",
        Data_Pedido: new Date().toLocaleDateString("pt-MZ"),
      };

      // Mensagem mais profissional e sem link desnecessário
      const mensagem = `
IMPERIAL SEGUROS - NOVA COTAÇÃO CRIADA

Detalhes da Cotação:
────────────────────
• Cliente: ${dadosCotacao.Nome_Usuario}
• Número da Cotação: ${dadosCotacao.Nome_Documento}
• Tipo de Cobertura: ${dadosCotacao.Nome_Categoria}
• Departamento: ${dadosCotacao.Nome_Departamento}
• Estado: ${dadosCotacao.Estado}
• Data de Emissão: ${dadosCotacao.Data_Pedido}
• Valor Total: MT ${parseFloat(cotacao.totalPremio).toLocaleString("pt-MZ", {
        minimumFractionDigits: 2,
      })}
• Número de Veículos: ${cotacao.veiculos.length}

Resumo dos Veículos:
──────────────────
${cotacao.veiculos
  .map(
    (veiculo, index) => `
Veículo ${index + 1}:
• Marca/Modelo: ${veiculo.marcaModelo}
• Tipo: ${veiculo.tipoViatura}
• Capital Seguro: MT ${parseFloat(veiculo.capitalSeguro).toLocaleString(
      "pt-MZ"
    )}
• Prémio: MT ${parseFloat(veiculo.premioAnnual).toLocaleString("pt-MZ", {
      minimumFractionDigits: 2,
    })}
`
  )
  .join("")}

Esta é uma notificação automática do Sistema de Gestão de Seguros.
Por favor, acesse o sistema para visualizar os detalhes completos.

Atenciosamente,
Sistema Imperial Seguros
      `.trim();

      console.log("Preparando envio de email...");

      // Simulação mais realista do envio de email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui você deve integrar com seu backend real
      // Exemplo de integração com API:
      /*
      const response = await fetch('/api/enviar-email-cotacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinatarios: ['admin@imperialinsurance-mz.com'], // Ou buscar do localStorage
          assunto: `Nova Cotação - ${cotacao.id}`,
          mensagem: mensagem,
          dadosCotacao: dadosCotacao
        })
      });

      if (!response.ok) {
        throw new Error('Erro no envio do email');
      }
      */

      console.log("Email enviado com sucesso!");
      console.log("Destinatários: Administradores do sistema");
      console.log("Assunto: Nova Cotação de Seguro");
      console.log("Mensagem:", mensagem);

      alert(`✅ Cotação ${cotacao.id} enviada por email com sucesso!`);
      setMostrarOpcoesPartilha(false);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      alert("❌ Erro ao enviar email. Por favor, tente novamente.");
    } finally {
      setEnviandoEmail(false);
    }
  };

  // Função para gerar ID único da cotação
  const gerarIdCotacao = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CT${timestamp}${random}`;
  };

  // Função para salvar cotação
  const salvarCotacao = () => {
    if (!formData.email || veiculos.length === 0) {
      alert(
        "Preencha todos os dados do cliente e adicione pelo menos um veículo!"
      );
      return;
    }

    const novaCotacao = {
      id: gerarIdCotacao(),
      dataCriacao: new Date().toISOString(),
      cliente: {
        tipo: tipoCliente,
        ...formData,
      },
      veiculos: veiculos.map((v) => ({
        ...v,
        tipoCobertura: tipoCobertura,
        configCobertura: configCoberturas[tipoCobertura],
      })),
      totalPremio: calcularTotalPremio(),
      status: "ativa",
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setCotacoesSalvas((prev) => [...prev, novaCotacao]);
    setCotacaoGerada(novaCotacao);
    setMostrarOpcoesPartilha(true);

    // Salvar no localStorage
    const cotacoesExistentes = JSON.parse(
      localStorage.getItem("cotacoes") || "[]"
    );
    localStorage.setItem(
      "cotacoes",
      JSON.stringify([...cotacoesExistentes, novaCotacao])
    );

    alert("✅ Cotação criada com sucesso! ID: " + novaCotacao.id);
  };

  // Função para gerar PDF da cotação com layout MAIS PROFISSIONAL
  const gerarPDF = () => {
    if (!cotacaoGerada) return;

    const doc = new jsPDF();

    // Configurações
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    const checkPageBreak = (heightNeeded) => {
      if (yPosition + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Cabeçalho PROFISSIONAL
    doc.setFillColor(0, 82, 155); // Azul Imperial mais profissional
    doc.rect(0, 0, 210, 50, "F");

    // Logo area (espaço para logo)
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, 10, 30, 30, "F");
    doc.setTextColor(0, 82, 155);
    doc.setFontSize(8);
    doc.text("LOGO", margin + 15, 25, { align: "center" });

    // Título principal
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("IMPERIAL SEGUROS", margin + 40, 20);

    doc.setFontSize(10);
    doc.text("Seguradora Confiável | Serviço de Excelência", margin + 40, 27);
    doc.text(
      "Tel: +258 84 300 0000 | Email: comercial@imperialinsurance-mz.com",
      margin + 40,
      34
    );

    yPosition = 60;

    // Título do documento
    doc.setFontSize(18);
    doc.setTextColor(0, 82, 155);
    doc.text("COTAÇÃO DE SEGURO AUTOMÓVEL", 105, yPosition, {
      align: "center",
    });

    yPosition += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Nº: ${cotacaoGerada.id} | Emitida em: ${new Date().toLocaleDateString(
        "pt-MZ"
      )} | Válida por 30 dias`,
      105,
      yPosition,
      { align: "center" }
    );

    // Informações do Segurado
    yPosition += 15;
    checkPageBreak(40);

    // Header da seção
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 82, 155);
    doc.text("INFORMAÇÕES DO SEGURADO", margin + 2, yPosition + 6);

    yPosition += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const col1 = margin;
    const col2 = margin + 90;

    doc.text(
      `Nome: ${cotacaoGerada.cliente.tituloContato || ""} ${
        cotacaoGerada.cliente.primeiroNome
      } ${cotacaoGerada.cliente.sobrenome}`,
      col1,
      yPosition
    );
    doc.text(`Email: ${cotacaoGerada.cliente.email}`, col2, yPosition);
    yPosition += lineHeight;

    doc.text(
      `Documento: ${cotacaoGerada.cliente.numeroDocumento}`,
      col1,
      yPosition
    );
    doc.text(`Telefone: ${cotacaoGerada.cliente.telefone}`, col2, yPosition);
    yPosition += lineHeight;

    doc.text(
      `Tipo: ${
        cotacaoGerada.cliente.tipo === "Particular"
          ? "Cliente Particular"
          : "Cliente Empresarial"
      }`,
      col1,
      yPosition
    );
    yPosition += lineHeight;

    // Período de Seguro
    yPosition += 8;
    checkPageBreak(20);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 82, 155);
    doc.text("PERÍODO DE VIGÊNCIA", margin + 2, yPosition + 6);

    yPosition += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const dataInicio = new Date(cotacaoGerada.dataInicio).toLocaleDateString(
      "pt-MZ"
    );
    const dataFim = new Date(cotacaoGerada.dataFim).toLocaleDateString("pt-MZ");
    doc.text(
      `Início: ${dataInicio} | Término: ${dataFim} | Duração: 12 meses`,
      margin,
      yPosition
    );

    // Tabela de Prémios PROFISSIONAL
    yPosition += 15;
    checkPageBreak(100);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 82, 155);
    doc.text("COMPOSIÇÃO DO PRÉMIO", margin + 2, yPosition + 6);

    yPosition += 12;

    // Cabeçalho da tabela
    doc.setFillColor(0, 82, 155);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("DESCRIÇÃO", margin + 2, yPosition + 6);
    doc.text("VALOR (MT)", 160, yPosition + 6, { align: "right" });

    yPosition += 15;

    // Cálculos detalhados
    const premioBase = parseFloat(cotacaoGerada.totalPremio * 0.84);
    const custosAdmin = parseFloat(cotacaoGerada.totalPremio * 0.126);
    const sobreTaxa = parseFloat(cotacaoGerada.totalPremio * 0.0145);
    const imposto = parseFloat(cotacaoGerada.totalPremio * 0.0195);

    const linhas = [
      { desc: "Prémio Base do Seguro", valor: premioBase.toFixed(2) },
      { desc: "Custos Administrativos (12,6%)", valor: custosAdmin.toFixed(2) },
      { desc: "Sobre Taxa (1,45%)", valor: sobreTaxa.toFixed(2) },
      { desc: "Imposto de Selo (1,95%)", valor: imposto.toFixed(2) },
    ];

    doc.setTextColor(0, 0, 0);
    linhas.forEach((linha, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 4, 170, 10, "F");
      }
      doc.text(linha.desc, margin + 2, yPosition);
      doc.text(linha.valor, 160, yPosition, { align: "right" });
      yPosition += 10;
    });

    // Total
    yPosition += 5;
    doc.setFillColor(0, 82, 155);
    doc.rect(margin, yPosition, 170, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DO PRÉMIO", margin + 2, yPosition + 7);
    doc.text(
      parseFloat(cotacaoGerada.totalPremio).toLocaleString("pt-MZ", {
        minimumFractionDigits: 2,
      }),
      160,
      yPosition + 7,
      { align: "right" }
    );

    // Detalhes dos Veículos
    cotacaoGerada.veiculos.forEach((veiculo, index) => {
      yPosition += 20;
      checkPageBreak(120);

      // Header do veículo
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, 170, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 82, 155);
      doc.text(
        `VIATURA ${index + 1} - ${veiculo.marcaModelo}`,
        margin + 2,
        yPosition + 6
      );

      yPosition += 12;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      // Informações em duas colunas
      const infoCol1 = [
        `Marca/Modelo: ${veiculo.marcaModelo}`,
        `Matrícula: ${veiculo.matricula || "Por atribuir"}`,
        `Ano: ${veiculo.ano || "N/A"}`,
        `Chassi: ${veiculo.chassis || "N/A"}`,
      ];

      const infoCol2 = [
        `Motor: ${veiculo.motor || "N/A"}`,
        `Lotação: ${veiculo.lotacao || "N/A"}`,
        `Tipo: ${veiculo.tipoViatura}`,
        `Capital Seguro: MT ${parseFloat(veiculo.capitalSeguro).toLocaleString(
          "pt-MZ"
        )}`,
      ];

      infoCol1.forEach((info, i) => {
        doc.text(info, col1, yPosition);
        if (infoCol2[i]) {
          doc.text(infoCol2[i], col2, yPosition);
        }
        yPosition += lineHeight;
      });

      // Detalhes financeiros do veículo
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text("DETALHES FINANCEIROS:", col1, yPosition);
      yPosition += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(
        `Taxa Aplicada: ${(veiculo.taxa * 100).toFixed(2)}%`,
        col1,
        yPosition
      );
      doc.text(
        `Prémio Anual: MT ${parseFloat(veiculo.premioAnnual).toLocaleString(
          "pt-MZ",
          { minimumFractionDigits: 2 }
        )}`,
        col2,
        yPosition
      );

      // Coberturas
      yPosition += 10;
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, 170, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 82, 155);
      doc.text("COBERTURAS INCLUÍDAS", margin + 2, yPosition + 6);

      yPosition += 12;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      const cobertura = veiculo.configCobertura;
      if (cobertura) {
        let coberturaCount = 0;
        Object.entries(cobertura.coberturas).forEach(([key, value]) => {
          if (value > 0) {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .replace("Rc", "RC")
              .replace("Dp", "DP");

            if (yPosition > pageHeight - 15) {
              doc.addPage();
              yPosition = margin;
            }

            if (coberturaCount % 2 === 0) {
              doc.text(`• ${label}:`, col1, yPosition);
              doc.text(
                `MT ${value.toLocaleString("pt-MZ")}`,
                col1 + 80,
                yPosition
              );
            } else {
              doc.text(`• ${label}:`, col2, yPosition);
              doc.text(
                `MT ${value.toLocaleString("pt-MZ")}`,
                col2 + 80,
                yPosition
              );
              yPosition += lineHeight;
            }
            coberturaCount++;
          }
        });
        if (coberturaCount % 2 !== 0) yPosition += lineHeight;
      }
    });

    // Condições Gerais
    yPosition += 15;
    checkPageBreak(80);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 82, 155);
    doc.text("CONDIÇÕES GERAIS", margin + 2, yPosition + 6);

    yPosition += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const condicoes = [
      "• Esta cotação tem validade de 30 dias a partir da data de emissão",
      "• O prémio é pago anualmente antecipadamente",
      "• Os veículos devem estar em condições legais de circulação",
      "• O condutor deve possuir carta de condução válida",
      "• Vistória prévia obrigatória para veículos com mais de 5 anos",
      "• Franquias aplicáveis conforme tipo de cobertura selecionado",
      "• Cláusulas e condições sujeitas à apólice definitiva",
    ];

    condicoes.forEach((condicao) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(condicao, margin, yPosition, { maxWidth: 170 });
      yPosition += lineHeight * 1.3;
    });

    // Rodapé PROFISSIONAL
    const ultimaPagina = doc.internal.getNumberOfPages();
    doc.setPage(ultimaPagina);

    yPosition = pageHeight - 40;
    doc.setFillColor(0, 82, 155);
    doc.rect(0, yPosition, 210, 40, "F");

    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);

    // Informações de contacto
    doc.text("IMPERIAL SEGUROS MOÇAMBIQUE, S.A.", margin, yPosition + 8);
    doc.text(
      "Av. 25 de Setembro, 1462 • Maputo • Moçambique",
      margin,
      yPosition + 13
    );
    doc.text(
      "Tel: +258 84 300 0000 • Email: info@imperialinsurance-mz.com",
      margin,
      yPosition + 18
    );
    doc.text(
      "www.imperialinsurance-mz.com • NUIT: 123456789",
      margin,
      yPosition + 23
    );

    // Informações do documento
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text(
      `Documento gerado eletronicamente • ${new Date().toLocaleString(
        "pt-MZ"
      )} • Página ${ultimaPagina} de ${ultimaPagina}`,
      105,
      yPosition + 32,
      { align: "center" }
    );

    // Salvar o PDF
    doc.save(`cotacao-${cotacaoGerada.id}.pdf`);
  };

  // Função para visualizar PDF
  const visualizarPDF = () => {
    gerarPDF();
  };

  // Função para imprimir
  const imprimirCotacao = () => {
    const conteudo = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cotacao ${cotacaoGerada.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              background: #f8fafc;
              line-height: 1.6;
            }
            
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 0;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #00529b 0%, #003366 100%);
              color: white;
              padding: 30px 40px;
              text-align: center;
              position: relative;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #ffd700, #ff6b00);
            }
            
            .logo-area {
              width: 80px;
              height: 80px;
              background: white;
              border-radius: 12px;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #00529b;
              font-weight: bold;
              font-size: 12px;
              border: 2px dashed #00529b;
            }
            
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header h2 {
              margin: 8px 0 0 0;
              font-size: 16px;
              font-weight: 400;
              opacity: 0.9;
            }
            
            .document-info {
              background: #e3f2fd;
              padding: 15px 40px;
              border-bottom: 1px solid #bbdefb;
              font-size: 12px;
              color: #00529b;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .section {
              padding: 25px 40px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .section:last-child {
              border-bottom: none;
            }
            
            .section-title {
              color: #00529b;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 20px;
              padding-bottom: 8px;
              border-bottom: 2px solid #00529b;
              display: flex;
              align-items: center;
            }
            
            .section-title::before {
              content: '▶';
              margin-right: 8px;
              font-size: 12px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
            }
            
            .info-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
              margin-bottom: 4px;
            }
            
            .info-value {
              font-size: 14px;
              color: #1e293b;
              font-weight: 500;
            }
            
            .table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            
            .table th {
              background: #00529b;
              color: white;
              padding: 12px 15px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
            }
            
            .table td {
              padding: 12px 15px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 13px;
            }
            
            .table tr:nth-child(even) {
              background: #f8fafc;
            }
            
            .table tr:hover {
              background: #f1f5f9;
            }
            
            .total-row {
              background: #00529b !important;
              color: white;
              font-weight: 600;
              font-size: 14px;
            }
            
            .vehicle-card {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #00529b;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
              border: 1px solid #e2e8f0;
            }
            
            .vehicle-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .vehicle-title {
              font-size: 16px;
              font-weight: 600;
              color: #00529b;
            }
            
            .vehicle-type {
              background: #e3f2fd;
              color: #00529b;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
            }
            
            .coverage-list {
              list-style: none;
              padding: 0;
              margin: 15px 0 0 0;
            }
            
            .coverage-list li {
              padding: 8px 0;
              border-bottom: 1px solid #f1f5f9;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 13px;
            }
            
            .coverage-list li:before {
              content: "✓";
              color: #10b981;
              font-weight: bold;
              margin-right: 10px;
            }
            
            .coverage-value {
              color: #00529b;
              font-weight: 600;
              font-size: 12px;
            }
            
            .footer {
              background: #1e293b;
              color: white;
              padding: 25px 40px;
              text-align: center;
              font-size: 11px;
              line-height: 1.5;
            }
            
            .footer p {
              margin: 4px 0;
              opacity: 0.8;
            }
            
            .conditions {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              font-size: 12px;
            }
            
            .conditions h4 {
              color: #856404;
              margin-bottom: 10px;
              font-size: 13px;
            }
            
            .conditions ul {
              padding-left: 20px;
              margin: 0;
            }
            
            .conditions li {
              margin-bottom: 5px;
              color: #856404;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              
              .container {
                box-shadow: none;
                border-radius: 0;
              }
              
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-area">LOGO</div>
              <h1>IMPERIAL SEGUROS</h1>
              <h2>COTAÇÃO DE SEGURO AUTOMÓVEL</h2>
            </div>
            
            <div class="document-info">
              <div><strong>Nº:</strong> ${cotacaoGerada.id}</div>
              <div><strong>Emissão:</strong> ${new Date().toLocaleDateString(
                "pt-MZ"
              )}</div>
              <div><strong>Validade:</strong> 30 dias</div>
            </div>
            
            <div class="section">
              <div class="section-title">INFORMAÇÕES DO SEGURADO</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">NOME COMPLETO</span>
                  <span class="info-value">${
                    cotacaoGerada.cliente.tituloContato || ""
                  } ${cotacaoGerada.cliente.primeiroNome} ${
      cotacaoGerada.cliente.sobrenome
    }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">EMAIL</span>
                  <span class="info-value">${cotacaoGerada.cliente.email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">DOCUMENTO</span>
                  <span class="info-value">${
                    cotacaoGerada.cliente.numeroDocumento
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">TELEFONE</span>
                  <span class="info-value">${
                    cotacaoGerada.cliente.telefone
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">TIPO DE CLIENTE</span>
                  <span class="info-value">${
                    cotacaoGerada.cliente.tipo === "Particular"
                      ? "Cliente Particular"
                      : "Cliente Empresarial"
                  }</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">COMPOSIÇÃO DO PRÉMIO</div>
              <table class="table">
                <tr>
                  <th>DESCRIÇÃO</th>
                  <th style="text-align: right">VALOR (MT)</th>
                </tr>
                <tr>
                  <td>Prémio Base do Seguro</td>
                  <td style="text-align: right">${parseFloat(
                    cotacaoGerada.totalPremio * 0.84
                  ).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Custos Administrativos (12,6%)</td>
                  <td style="text-align: right">${parseFloat(
                    cotacaoGerada.totalPremio * 0.126
                  ).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Sobre Taxa (1,45%)</td>
                  <td style="text-align: right">${parseFloat(
                    cotacaoGerada.totalPremio * 0.0145
                  ).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Imposto de Selo (1,95%)</td>
                  <td style="text-align: right">${parseFloat(
                    cotacaoGerada.totalPremio * 0.0195
                  ).toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>TOTAL DO PRÉMIO</td>
                  <td style="text-align: right">${parseFloat(
                    cotacaoGerada.totalPremio
                  ).toLocaleString("pt-MZ", { minimumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">VEÍCULOS SEGURADOS</div>
              ${cotacaoGerada.veiculos
                .map(
                  (veiculo, index) => `
                <div class="vehicle-card">
                  <div class="vehicle-header">
                    <div class="vehicle-title">Viatura ${index + 1}: ${
                    veiculo.marcaModelo
                  }</div>
                    <div class="vehicle-type">${veiculo.tipoViatura}</div>
                  </div>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">MATRÍCULA</span>
                      <span class="info-value">${
                        veiculo.matricula || "Por atribuir"
                      }</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">ANO</span>
                      <span class="info-value">${veiculo.ano || "N/A"}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">CAPITAL SEGURO</span>
                      <span class="info-value">MT ${parseFloat(
                        veiculo.capitalSeguro
                      ).toLocaleString("pt-MZ")}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">PRÉMIO ANUAL</span>
                      <span class="info-value">MT ${parseFloat(
                        veiculo.premioAnnual
                      ).toLocaleString("pt-MZ", {
                        minimumFractionDigits: 2,
                      })}</span>
                    </div>
                  </div>
                  
                  <div style="margin-top: 15px;">
                    <strong style="color: #00529b; font-size: 13px;">COBERTURAS INCLUÍDAS:</strong>
                    <ul class="coverage-list">
                      ${
                        veiculo.configCobertura
                          ? Object.entries(veiculo.configCobertura.coberturas)
                              .map(([key, value]) =>
                                value > 0
                                  ? `<li>
                                      <span>${key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        )
                                        .replace("Rc", "RC")
                                        .replace("Dp", "DP")}</span>
                                      <span class="coverage-value">MT ${value.toLocaleString(
                                        "pt-MZ"
                                      )}</span>
                                    </li>`
                                  : ""
                              )
                              .join("")
                          : ""
                      }
                    </ul>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="section">
              <div class="section-title">CONDIÇÕES GERAIS</div>
              <div class="conditions">
                <ul>
                  <li>Esta cotação tem validade de 30 dias a partir da data de emissão</li>
                  <li>O prémio é pago anualmente antecipadamente</li>
                  <li>Os veículos devem estar em condições legais de circulação</li>
                  <li>O condutor deve possuir carta de condução válida</li>
                  <li>Vistória prévia obrigatória para veículos com mais de 5 anos</li>
                  <li>Franquias aplicáveis conforme tipo de cobertura selecionado</li>
                  <li>Cláusulas e condições sujeitas à apólice definitiva</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p><strong>IMPERIAL SEGUROS MOÇAMBIQUE, S.A.</strong></p>
              <p>Av. 25 de Setembro, 1462 • Maputo • Moçambique</p>
              <p>Tel: +258 84 300 0000 • Email: info@imperialinsurance-mz.com • www.imperialinsurance-mz.com</p>
              <p style="margin-top: 10px; opacity: 0.6;">Documento gerado eletronicamente em ${new Date().toLocaleString(
                "pt-MZ"
              )}</p>
            </div>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 20px; padding: 20px;">
            <button onclick="window.print()" style="background: #00529b; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              🖨️ Imprimir Cotação
            </button>
          </div>
        </body>
      </html>
    `;

    const janela = window.open("", "_blank");
    janela.document.write(conteudo);
    janela.document.close();
  };

  // Função para enviar cotação por email - CORRIGIDA
  const enviarEmail = async () => {
    if (!cotacaoGerada) return;

    // Verificar se há dados necessários
    if (!cotacaoGerada.cliente.email) {
      alert("❌ É necessário ter um email do cliente para enviar a cotação.");
      return;
    }

    await enviarEmailCotacao(cotacaoGerada);
  };

  // Restante das funções existentes (manter igual)
  const calcularPremio = (
    capitalSeguro,
    tipoViatura,
    cobertura,
    taxaSelecionada
  ) => {
    const config = configCoberturas[cobertura];
    if (!config || !tipoViatura) return { taxa: 0, premioAnnual: "0.00" };

    const capital = parseFloat(capitalSeguro) || 0;
    if (capital === 0) return { taxa: 0, premioAnnual: "0.00" };

    let taxa;
    if (
      taxaSelecionada &&
      taxaSelecionada !== "" &&
      taxaSelecionada !== null &&
      taxaSelecionada !== undefined
    ) {
      taxa = parseFloat(taxaSelecionada);
    } else {
      taxa = config.taxas[tipoViatura] || 0;
    }

    if (taxa === 0) return { taxa: 0, premioAnnual: "0.00" };

    const premioCalculado = capital * taxa;
    const premioMinimo = config.premioMinimo[tipoViatura] || 0;
    const premioFinal = Math.max(premioCalculado, premioMinimo);

    return {
      taxa: taxa,
      premioAnnual: premioFinal.toFixed(2),
      premioCalculado: premioCalculado.toFixed(2),
      premioMinimo: premioMinimo,
    };
  };

  useEffect(() => {
    if (
      veiculoAtual.capitalSeguro &&
      veiculoAtual.tipoViatura &&
      tipoCobertura
    ) {
      const resultado = calcularPremio(
        veiculoAtual.capitalSeguro,
        veiculoAtual.tipoViatura,
        tipoCobertura,
        veiculoAtual.taxaSelecionada
      );

      setVeiculoAtual((prev) => ({
        ...prev,
        taxa: resultado.taxa,
        premioAnnual: resultado.premioAnnual,
      }));
    }
  }, [
    veiculoAtual.capitalSeguro,
    veiculoAtual.tipoViatura,
    tipoCobertura,
    veiculoAtual.taxaSelecionada,
  ]);

  useEffect(() => {
    if (veiculoAtual.tipoViatura && tipoCobertura) {
      setVeiculoAtual((prev) => ({
        ...prev,
        taxaSelecionada: "",
      }));
    }
  }, [veiculoAtual.tipoViatura, tipoCobertura]);

  const handleTipoClienteChange = (novoTipo) => {
    if (novoTipo !== tipoCliente) {
      setIsSwitching(true);
      setTimeout(() => {
        setTipoCliente(novoTipo);
        setIsSwitching(false);
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    salvarCotacao();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVeiculoChange = (field, value) => {
    setVeiculoAtual((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adicionarVeiculo = () => {
    if (
      !veiculoAtual.marcaModelo ||
      !veiculoAtual.tipoViatura ||
      !veiculoAtual.capitalSeguro
    ) {
      alert("Preencha os campos obrigatórios do veículo!");
      return;
    }

    setVeiculos((prev) => [
      ...prev,
      {
        ...veiculoAtual,
        id: Date.now(),
        taxaUsada:
          veiculoAtual.taxaSelecionada ||
          getConfigCobertura()?.taxas[veiculoAtual.tipoViatura],
      },
    ]);
    setVeiculoAtual({
      marcaModelo: "",
      matricula: "",
      ano: "",
      motor: "",
      chassis: "",
      lotacao: "",
      tipoViatura: "",
      capitalSeguro: "",
      taxa: "",
      taxaSelecionada: "",
      premioAnnual: "",
    });
  };

  const removerVeiculo = (id) => {
    setVeiculos((prev) => prev.filter((v) => v.id !== id));
  };

  const calcularTotalPremio = () => {
    return veiculos.reduce(
      (total, veiculo) => total + (parseFloat(veiculo.premioAnnual) || 0),
      0
    );
  };

  const getPaisSelecionado = () => {
    return (
      paises.find((pais) => pais.code === formData.nacionalidade) || paises[0]
    );
  };

  const getConfigCobertura = () => {
    return tipoCobertura ? configCoberturas[tipoCobertura] : null;
  };

  const getTaxasDisponiveis = () => {
    if (!tipoCobertura || !veiculoAtual.tipoViatura) return [];
    return getConfigCobertura()?.taxasOpcoes[veiculoAtual.tipoViatura] || [];
  };

  const formatarTaxa = (taxa) => {
    return `${(taxa * 100).toFixed(1)}%`;
  };

  const formatarMoeda = (valor) => {
    return `MT ${parseFloat(valor).toLocaleString("pt-MZ", {
      minimumFractionDigits: 2,
    })}`;
  };

  const processarPagamento = async () => {
    if (!formaPagamento) {
      alert("Selecione uma forma de pagamento!");
      return;
    }

    if (
      (formaPagamento === "M-PESA" && !contactoMPesa) ||
      (formaPagamento === "E-MOLA" && !contactoEMola)
    ) {
      alert("Preencha o contacto para a forma de pagamento selecionada!");
      return;
    }

    if (!pinPagamento) {
      alert("Digite o PIN de autorização!");
      return;
    }

    setProcessandoPagamento(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      alert("✅ Pagamento processado com sucesso!");
      setMostrarPagamento(false);
      setFormaPagamento("");
      setContactoMPesa("");
      setContactoEMola("");
      setPinPagamento("");
    } catch (error) {
      alert("❌ Erro no processamento do pagamento. Tente novamente.");
    } finally {
      setProcessandoPagamento(false);
    }
  };

  // ... (restante do JSX permanece igual, apenas atualizei o botão de email no modal)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            {tipoCliente === "Particular"
              ? "Criar Nova Cotação"
              : "Criar Cotação Empresarial"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#106a37]">
            <div className="w-8 h-px bg-[#106a37]" />
            <p className="text-sm font-medium">
              Os campos assinalados com * são obrigatórios
            </p>
            <div className="w-8 h-px bg-[#106a37]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Container Principal - Dados do Cliente */}
          <div className="rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-green-600/20">
            {/* Seletor de Tipo de Cliente */}
            <div className="p-6 border-b border-green-600/20">
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => handleTipoClienteChange("Particular")}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${
                    tipoCliente === "Particular"
                      ? "bg-green-600 text-white shadow-2xl scale-105"
                      : "bg-gray-700 text-gray-300 hover:bg-green-600 hover:bg-opacity-30"
                  } ${isSwitching ? "animate-pulse" : ""}`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Particular</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTipoClienteChange("Empresarial")}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${
                    tipoCliente === "Empresarial"
                      ? "bg-green-600 text-white shadow-2xl scale-105"
                      : "bg-gray-700 text-gray-300 hover:bg-green-600 hover:bg-opacity-30"
                  } ${isSwitching ? "animate-pulse" : ""}`}
                >
                  <Building className="h-5 w-5" />
                  <span className="font-semibold">Empresarial</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`transition-all duration-500 ${
                  isSwitching ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {tipoCliente === "Particular" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Nacionalidade *
                      </label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4 z-10" />
                        <select
                          required
                          className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                          value={formData.nacionalidade}
                          onChange={(e) =>
                            handleInputChange("nacionalidade", e.target.value)
                          }
                        >
                          {paises.map((pais, index) => (
                            <option key={index} value={pais.code}>
                              {pais.flag} {pais.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
                          <span className="text-lg">
                            {getPaisSelecionado().flag}
                          </span>
                          <ChevronDown className="text-green-400 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                )}

                {tipoCliente === "Particular" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-green-500 rounded-full" />
                      <h3 className="text-xl font-bold text-white">
                        Dados Pessoais
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Título de Contato
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4 z-10" />
                          <select
                            className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                            value={formData.tituloContato}
                            onChange={(e) =>
                              handleInputChange("tituloContato", e.target.value)
                            }
                          >
                            <option value="">- Selecionar -</option>
                            {titulosContato.map((titulo, index) => (
                              <option key={index} value={titulo}>
                                {titulo}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4 z-10" />
                        </div>
                      </div>

                      <div className="lg:col-span-2"></div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Primeiro Nome *
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="Primeiro nome"
                            value={formData.primeiroNome}
                            onChange={(e) =>
                              handleInputChange("primeiroNome", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Sobrenome *
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="Sobrenome"
                            value={formData.sobrenome}
                            onChange={(e) =>
                              handleInputChange("sobrenome", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Telefone Móvel *
                        </label>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="tel"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="+258"
                            value={formData.telefone}
                            onChange={(e) =>
                              handleInputChange("telefone", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Email *
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Nº Documento *
                        </label>
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="BI/Passaporte"
                            value={formData.numeroDocumento}
                            onChange={(e) =>
                              handleInputChange(
                                "numeroDocumento",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Data de Nascimento *
                        </label>
                        <div className="relative group">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="date"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            value={formData.dataNascimento}
                            onChange={(e) =>
                              handleInputChange(
                                "dataNascimento",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-green-500 rounded-full" />
                      <h3 className="text-xl font-bold text-white">
                        Dados da Empresa
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Nacionalidade *
                        </label>
                        <div className="relative group">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4 z-10" />
                          <select
                            required
                            className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                            value={formData.nacionalidade}
                            onChange={(e) =>
                              handleInputChange("nacionalidade", e.target.value)
                            }
                          >
                            {paises.map((pais, index) => (
                              <option key={index} value={pais.code}>
                                {pais.flag} {pais.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
                            <span className="text-lg">
                              {getPaisSelecionado().flag}
                            </span>
                            <ChevronDown className="text-green-400 h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Nome da Empresa *
                        </label>
                        <div className="relative group">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="Nome da empresa"
                            value={formData.nomeEmpresa}
                            onChange={(e) =>
                              handleInputChange("nomeEmpresa", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Número de Referência Fiscal *
                        </label>
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="Número de referência fiscal"
                            value={formData.numeroReferenciaFiscal}
                            onChange={(e) =>
                              handleInputChange(
                                "numeroReferenciaFiscal",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Email *
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                          <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-green-500 bg-gray-700 border border-gray-600"
                            placeholder="empresa@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="p-6 border-t border-green-600/20">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 font-semibold border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </button>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowVehicleForm(true)}
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Car className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Adicionar Veículo</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group bg-green-600 text-white hover:bg-green-700"
                  >
                    <Save className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Gerar Cotação</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO DE DADOS DA VIATURA */}
          {showVehicleForm && (
            <div className="rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-gray-900 border-blue-600/20">
              <div className="p-6 border-b border-blue-600/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-blue-500 rounded-full" />
                  <h3 className="text-xl font-bold text-white">
                    Dados da Viatura
                  </h3>
                </div>

                {/* Seleção do Tipo de Cobertura */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Tipo de Cobertura *
                    </label>
                    <div className="relative group">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                      <select
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                        value={tipoCobertura}
                        onChange={(e) => setTipoCobertura(e.target.value)}
                      >
                        <option value="">- Selecionar Cobertura -</option>
                        <option value="DP_NORMAL">
                          DP NORMAL - Danos Próprios com Franquia
                        </option>
                        <option value="DP_SEM_FRANQUIA">
                          DP SEM FRANQUIA - Danos Próprios sem Franquia
                        </option>
                        <option value="RC_NORMAL">
                          RC NORMAL - Apenas Responsabilidade Civil
                        </option>
                        <option value="RC_OCUPANTES">
                          RC & OCUPANTES - RC + Cobertura para Ocupantes
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                    </div>
                  </div>

                  {tipoCobertura && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Resumo da Cobertura
                      </label>
                      <div className="p-3 rounded-xl text-sm text-white bg-blue-600/10 border border-blue-600/30">
                        <div className="font-semibold">
                          {getConfigCobertura()?.nome}
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          Taxas Padrão: Ligeiro{" "}
                          {getConfigCobertura()?.taxas.Ligeiro * 100}% | Pesado{" "}
                          {getConfigCobertura()?.taxas.Pesado * 100}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Formulário de Dados do Veículo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Marca / Modelo *
                    </label>
                    <div className="relative group">
                      <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Ex: Toyota Corolla"
                        value={veiculoAtual.marcaModelo}
                        onChange={(e) =>
                          handleVeiculoChange("marcaModelo", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Matrícula
                    </label>
                    <div className="relative group">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Ex: AB-123-CD"
                        value={veiculoAtual.matricula}
                        onChange={(e) =>
                          handleVeiculoChange("matricula", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Ano
                    </label>
                    <div className="relative group">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Ex: 2023"
                        value={veiculoAtual.ano}
                        onChange={(e) =>
                          handleVeiculoChange("ano", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Motor
                    </label>
                    <div className="relative group">
                      <Cog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Ex: 1.6L"
                        value={veiculoAtual.motor}
                        onChange={(e) =>
                          handleVeiculoChange("motor", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Chassis
                    </label>
                    <div className="relative group">
                      <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Número do chassis"
                        value={veiculoAtual.chassis}
                        onChange={(e) =>
                          handleVeiculoChange("chassis", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Lotação
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Nº de passageiros"
                        value={veiculoAtual.lotacao}
                        onChange={(e) =>
                          handleVeiculoChange("lotacao", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Tipo de Viatura *
                    </label>
                    <div className="relative group">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                      <select
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                        value={veiculoAtual.tipoViatura}
                        onChange={(e) =>
                          handleVeiculoChange("tipoViatura", e.target.value)
                        }
                      >
                        <option value="">- Selecionar -</option>
                        <option value="Ligeiro">Ligeiro</option>
                        <option value="Pesado">Pesado</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Capital Seguro (MT) *
                    </label>
                    <div className="relative group">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="number"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 bg-gray-700 border border-gray-600"
                        placeholder="Valor em MT"
                        value={veiculoAtual.capitalSeguro}
                        onChange={(e) =>
                          handleVeiculoChange("capitalSeguro", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {veiculoAtual.tipoViatura && tipoCobertura && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Selecionar Taxa
                      </label>
                      <div className="relative group">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                        <select
                          className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                          value={veiculoAtual.taxaSelecionada}
                          onChange={(e) => {
                            const novaTaxa = e.target.value;
                            setVeiculoAtual((prev) => {
                              const novoEstado = {
                                ...prev,
                                taxaSelecionada: novaTaxa,
                              };
                              if (
                                novoEstado.capitalSeguro &&
                                novoEstado.tipoViatura &&
                                tipoCobertura
                              ) {
                                const resultado = calcularPremio(
                                  novoEstado.capitalSeguro,
                                  novoEstado.tipoViatura,
                                  tipoCobertura,
                                  novaTaxa === "" ? null : novaTaxa
                                );
                                return {
                                  ...novoEstado,
                                  taxa: resultado.taxa,
                                  premioAnnual: resultado.premioAnnual,
                                };
                              }
                              return novoEstado;
                            });
                          }}
                        >
                          <option value="">
                            Padrão (
                            {formatarTaxa(
                              getConfigCobertura()?.taxas[
                                veiculoAtual.tipoViatura
                              ]
                            )}
                            )
                          </option>
                          {getTaxasDisponiveis().map((taxa, index) => (
                            <option key={index} value={taxa}>
                              {formatarTaxa(taxa)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 z-10" />
                      </div>
                      <div className="text-xs text-gray-400">
                        {veiculoAtual.taxaSelecionada
                          ? `Taxa personalizada selecionada: ${formatarTaxa(
                              veiculoAtual.taxaSelecionada
                            )}`
                          : `Usando taxa padrão: ${formatarTaxa(
                              getConfigCobertura()?.taxas[
                                veiculoAtual.tipoViatura
                              ]
                            )}`}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Taxa Aplicada
                    </label>
                    <div className="relative group">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        readOnly
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white font-semibold bg-gray-600 border border-gray-600"
                        value={
                          veiculoAtual.taxa
                            ? `${(veiculoAtual.taxa * 100).toFixed(1)}%`
                            : ""
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Prémio Annual (MT)
                    </label>
                    <div className="relative group">
                      <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                      <input
                        type="text"
                        readOnly
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white font-semibold bg-gray-600 border border-gray-600"
                        value={
                          veiculoAtual.premioAnnual
                            ? formatarMoeda(veiculoAtual.premioAnnual)
                            : ""
                        }
                      />
                    </div>
                    {veiculoAtual.premioAnnual &&
                      veiculoAtual.capitalSeguro &&
                      veiculoAtual.tipoViatura &&
                      tipoCobertura &&
                      (() => {
                        const config = getConfigCobertura();
                        const capital =
                          parseFloat(veiculoAtual.capitalSeguro) || 0;
                        const taxa =
                          veiculoAtual.taxa ||
                          config?.taxas[veiculoAtual.tipoViatura] ||
                          0;
                        const premioCalculado = capital * taxa;
                        const premioMinimo =
                          config?.premioMinimo[veiculoAtual.tipoViatura] || 0;
                        const premioFinal = parseFloat(
                          veiculoAtual.premioAnnual
                        );

                        return (
                          <div className="text-xs text-gray-400">
                            {premioFinal === premioMinimo &&
                            premioCalculado < premioMinimo
                              ? `* Aplicado prémio mínimo (Calculado: ${formatarMoeda(
                                  premioCalculado
                                )})`
                              : `Calculado: ${formatarMoeda(capital)} × ${(
                                  taxa * 100
                                ).toFixed(1)}% = ${formatarMoeda(
                                  premioCalculado
                                )}`}
                          </div>
                        );
                      })()}
                  </div>
                </div>

                {/* Botão para Adicionar Veículo */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={adicionarVeiculo}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group bg-green-600 text-white hover:bg-green-700"
                  >
                    <Car className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Adicionar Veículo à Lista</span>
                  </button>
                </div>
              </div>

              {/* Lista de Veículos Adicionados */}
              {veiculos.length > 0 && (
                <div className="p-6 border-t border-blue-600/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-green-500 rounded-full" />
                    <h4 className="text-lg font-bold text-white">
                      Veículos Adicionados
                    </h4>
                    <span className="px-2 py-1 bg-green-500 text-white text-sm rounded-full">
                      {veiculos.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {veiculos.map((veiculo) => (
                      <div
                        key={veiculo.id}
                        className="p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:scale-[1.02] bg-green-600/10 border border-green-600/30"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {veiculo.marcaModelo} • {veiculo.tipoViatura}
                          </div>
                          <div className="text-sm text-gray-300">
                            Capital: MT{" "}
                            {parseFloat(veiculo.capitalSeguro).toLocaleString(
                              "pt-MZ"
                            )}{" "}
                            • Taxa: {(veiculo.taxaUsada * 100).toFixed(1)}% •
                            Prémio: MT{" "}
                            {parseFloat(veiculo.premioAnnual).toLocaleString(
                              "pt-MZ",
                              { minimumFractionDigits: 2 }
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerVeiculo(veiculo.id)}
                          className="px-3 py-1 rounded-lg text-red-400 hover:text-red-300 transition-colors duration-300 bg-red-600/10 border border-red-600/30"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total do Prémio */}
                  <div className="mt-6 p-4 rounded-xl text-center bg-blue-600/10 border border-blue-600/30">
                    <div className="text-lg font-bold text-white">
                      Total do Prémio Anual:{" "}
                      {formatarMoeda(calcularTotalPremio())}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      {veiculos.length} veículo(s) adicionado(s)
                    </div>
                  </div>

                  {/* Botão para Processar Pagamento */}
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setMostrarPagamento(true)}
                      className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group bg-purple-600 text-white hover:bg-purple-700"
                    >
                      <CreditCard className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-lg">Processar Pagamento</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de Ação do Formulário da Viatura */}
              <div className="p-6 border-t border-blue-600/20">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowVehicleForm(false)}
                    className="px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 font-semibold border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Fechar Formulário
                  </button>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setVeiculos([]);
                        setVeiculoAtual({
                          marcaModelo: "",
                          matricula: "",
                          ano: "",
                          motor: "",
                          chassis: "",
                          lotacao: "",
                          tipoViatura: "",
                          capitalSeguro: "",
                          taxa: "",
                          taxaSelecionada: "",
                          premioAnnual: "",
                        });
                        setTipoCobertura("");
                      }}
                      className="px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 font-semibold border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      Limpar Tudo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORMULÁRIO DE PAGAMENTO */}
          {mostrarPagamento && veiculos.length > 0 && (
            <div className="rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-gray-900 border-purple-600/20">
              <div className="p-6 border-b border-purple-600/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-bold text-white">
                    Processar Pagamento
                  </h3>
                </div>

                {/* Resumo do Valor */}
                <div className="mb-6 p-4 rounded-xl text-center bg-purple-600/10 border border-purple-600/30">
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatarMoeda(calcularTotalPremio())}
                  </div>
                  <div className="text-sm text-gray-300">
                    Total a pagar por {veiculos.length} veículo(s)
                  </div>
                </div>

                {/* Forma de Pagamento */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Forma de Pagamento *
                    </label>
                    <div className="relative group">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4 z-10" />
                      <select
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer bg-gray-700 border border-gray-600"
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                      >
                        <option value="">- Selecionar -</option>
                        <option value="M-PESA">M-PESA (Vodacom)</option>
                        <option value="E-MOLA">E-MOLA (Movitel)</option>
                        <option value="NUMERARIO">Numerário</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4 z-10" />
                    </div>
                  </div>

                  {/* Campo de Contacto para M-PESA */}
                  {formaPagamento === "M-PESA" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Contacto Vodacom *
                      </label>
                      <div className="relative group">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
                        <input
                          type="tel"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-purple-500 bg-gray-700 border border-gray-600"
                          placeholder="+258 8X XXX XXXX"
                          value={contactoMPesa}
                          onChange={(e) => setContactoMPesa(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Campo de Contacto para E-MOLA */}
                  {formaPagamento === "E-MOLA" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Contacto Movitel *
                      </label>
                      <div className="relative group">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
                        <input
                          type="tel"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-purple-500 bg-gray-700 border border-gray-600"
                          placeholder="+258 8X XXX XXXX"
                          value={contactoEMola}
                          onChange={(e) => setContactoEMola(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Campo PIN para M-PESA e E-MOLA */}
                {(formaPagamento === "M-PESA" ||
                  formaPagamento === "E-MOLA") && (
                  <div className="mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        PIN de Autorização *
                      </label>
                      <div className="relative group">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
                        <input
                          type="password"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] focus:ring-2 focus:ring-purple-500 bg-gray-700 border border-gray-600"
                          placeholder="Digite o PIN"
                          value={pinPagamento}
                          onChange={(e) => setPinPagamento(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                      <div className="text-xs text-gray-400">
                        Digite o PIN do seu{" "}
                        {formaPagamento === "M-PESA" ? "M-PESA" : "E-MOLA"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões de Ação do Pagamento */}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setMostrarPagamento(false)}
                    className="px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 font-semibold border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={processarPagamento}
                    disabled={processandoPagamento}
                    className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700"
                  >
                    {processandoPagamento ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span>Confirmar Pagamento</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* MODAL DE PARTILHA DA COTAÇÃO - ATUALIZADO */}
        {mostrarOpcoesPartilha && cotacaoGerada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl border-2 w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-green-600/20">
              <div className="p-6 border-b border-green-600/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-green-500 rounded-full" />
                    <h3 className="text-xl font-bold text-white">
                      Partilhar Cotação
                    </h3>
                  </div>
                  <button
                    onClick={() => setMostrarOpcoesPartilha(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/30">
                    <div className="text-white font-semibold">
                      Cotação: {cotacaoGerada.id}
                    </div>
                    <div className="text-gray-300 text-sm">
                      Cliente: {cotacaoGerada.cliente.primeiroNome}{" "}
                      {cotacaoGerada.cliente.sobrenome}
                    </div>
                    <div className="text-gray-300 text-sm">
                      Total: {formatarMoeda(cotacaoGerada.totalPremio)}
                    </div>
                    <div className="text-gray-300 text-sm">
                      Veículos: {cotacaoGerada.veiculos.length}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={visualizarPDF}
                      className="p-4 rounded-xl border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
                    >
                      <Eye className="h-8 w-8" />
                      <span className="font-semibold">Visualizar</span>
                      <span className="text-xs text-gray-400">Ver PDF</span>
                    </button>

                    <button
                      onClick={gerarPDF}
                      className="p-4 rounded-xl border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
                    >
                      <Download className="h-8 w-8" />
                      <span className="font-semibold">Download</span>
                      <span className="text-xs text-gray-400">Baixar PDF</span>
                    </button>

                    <button
                      onClick={imprimirCotacao}
                      className="p-4 rounded-xl border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
                    >
                      <Printer className="h-8 w-8" />
                      <span className="font-semibold">Imprimir</span>
                      <span className="text-xs text-gray-400">Imprimir</span>
                    </button>

                    <button
                      onClick={enviarEmail}
                      disabled={enviandoEmail}
                      className="p-4 rounded-xl border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {enviandoEmail ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      ) : (
                        <Send className="h-8 w-8" />
                      )}
                      <span className="font-semibold">
                        {enviandoEmail ? "Enviando..." : "Enviar Email"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Para administradores
                      </span>
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-400 mt-4">
                    A cotação foi salva com ID: {cotacaoGerada.id}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-green-600/20">
                <button
                  onClick={() => setMostrarOpcoesPartilha(false)}
                  className="w-full py-3 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CriarCliente;
