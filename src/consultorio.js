import PromptSync from 'prompt-sync';
import format from 'date-fns/format/index.js';
import Paciente from './paciente.js';
import Consulta from './consulta.js';

class Consultorio {
  #prompt;
  consultas;
  pacientes;
  #hoje;
  #dataAtual;

  constructor() {
    this.#prompt = PromptSync({ sigint: true });
    this.consultas = [];
    this.pacientes = [];
    this.#hoje = new Date();
    this.#dataAtual = `${this.#hoje.getDate()}/${this.#hoje.getMonth() + 1}/${this.#hoje.getFullYear()}`;
  }

  mainMenu() {
    let stop = false;
    while (!stop) {
      const option = this.#prompt("Menu principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim\n");

      switch (option) {
        case '1':
          this.cadastroPaciente();
          break;
        case '2':
          this.agenda();
          break;
        case '3':
          stop = true;
          break;
        default:
          console.log("Opção inválida, escolha novamente.");
          break;
      }
    }
  }

  cadastroPaciente() {
    const option = this.#prompt("Menu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal");

    switch (option) {
      case '1':
        this.cadastraNovoPaciente();
        break;
      case '2':
        this.excluiPaciente();
        break;
      case '3':
        this.listaPacientesCPF();
        break;
      case '4':
        this.listaPacientesNome();
        break;
      case '5':
        this.mainMenu();
        break;
      default:
        console.log("Opção inválida, escolha novamente.");
        this.cadastroPaciente();
        break;
    }
  }

  cadastraNovoPaciente() {
    const nome = this.#prompt("Insira seu nome: ");
    const cpf = this.#prompt("Insire seu cpf: ");
    const data = this.#prompt("Insira sua data de nascimento no formato DD/MM/AAAA: ");
    if (!this.validaNome(nome)) {
      console.log("Seu nome precisa ter 5 ou mais caracteres.");
      return false;
    } else if (!this.validaCPF(cpf)) {
      console.log("CPF inválido.");
      return false;
    } else if (!this.validarDataNascimento(data)) {
      console.log("Sua data de nascimento precisa estar no formato DD/MM/AAAA e você precisa ter 13 anos ou mais.");
      return false;
    } else if (this.pacienteExiste(cpf)) {
      console.log("CPF já cadastrado.");
      return false;
    } else {
      this.pacientes.push(new Paciente(cpf, nome, format(new Date(data), "dd/MM/yyyy")));
      console.log("Paciente cadastrado com sucesso.");
      return true;
    }
  }

  validaNome(nome) {
    return nome.length >= 5;
  }

  validaCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    // Verifica se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) {
      digit = 0;
    }

    // Verifica o primeiro dígito verificador
    if (parseInt(cpf.charAt(9)) !== digit) {
      return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) {
      digit = 0;
    }

    // Verifica o segundo dígito verificador
    if (parseInt(cpf.charAt(10)) !== digit) {
      return false;
    }

    return true;
  }

  validarDataNascimento(dataNascimento) {
    const partesData = dataNascimento.split('/');
    const dia = parseInt(partesData[0]);
    const mes = parseInt(partesData[1]) - 1;
    const ano = parseInt(partesData[2]);
    const dataFornecida = new Date(ano, mes, dia);
    const idadeMinima = 13;
    const dataAtual = new Date();
    return (
      (dataAtual - dataFornecida) / (1000 * 60 * 60 * 24 * 365) >= idadeMinima
    );
  }

  pacienteExiste(cpf) {
    return this.pacientes.some(paciente => paciente.cpf === cpf);
  }

  excluiPaciente() {
    const cpf = this.#prompt("Digite o CPF do paciente que deseja excluir: ");
    const pacienteIndex = this.pacientes.findIndex(paciente => paciente.cpf === cpf);

    if (pacienteIndex === -1) {
      console.log("Paciente não encontrado.");
      return;
    }

    const paciente = this.pacientes[pacienteIndex];

    if (this.temConsultaFutura(cpf)) {
      console.log("Não é possível excluir um paciente com consulta agendada futura.");
      return;
    }

    this.pacientes.splice(pacienteIndex, 1);
    console.log(`Paciente ${paciente.nome} removido com sucesso.`);
  }

  temConsultaFutura(cpf) {
    const consultasFuturas = this.consultas.filter(consulta =>
      consulta.cpf === cpf && this.isConsultaFutura(consulta)
    );
    return consultasFuturas.length > 0;
  }

  isConsultaFutura(consulta) {
    const [diaConsulta, mesConsulta, anoConsulta] = consulta.data.split('/');
    const [horaInicialConsulta, minutoInicialConsulta] = consulta.horaInicial.match(/\d{2}/g);
    const [horaAtual, minutoAtual] = format(new Date(), "HH:mm").split(':');

    const dataConsulta = new Date(anoConsulta, mesConsulta - 1, diaConsulta, horaInicialConsulta, minutoInicialConsulta);
    const dataAtual = new Date();

    return dataConsulta > dataAtual || (dataConsulta.getTime() === dataAtual.getTime() && horaInicialConsulta > horaAtual);
  }

  listaPacientesCPF() {
    const pacientesOrdenadosCPF = [...this.pacientes].sort((a, b) => a.cpf.localeCompare(b.cpf));
    this.exibePacientes(pacientesOrdenadosCPF);
  }

  listaPacientesNome() {
    const pacientesOrdenadosNome = [...this.pacientes].sort((a, b) => a.nome.localeCompare(b.nome));
    this.exibePacientes(pacientesOrdenadosNome);
  }

  exibePacientes(pacientes) {
    console.log("------------------------------------------------------------");
    console.log("CPF        Nome                                Dt.Nasc.  Idade");
    console.log("------------------------------------------------------------");

    for (const paciente of pacientes) {
      console.log(`${paciente.cpf} ${this.formatarNome(paciente.nome)} ${paciente.dataNascimento} ${this.calcularIdade(paciente.dataNascimento)}`);
      const consultasFuturas = this.consultas.filter(
        consulta => consulta.cpf === paciente.cpf && this.isConsultaFutura(consulta)
      );
      if (consultasFuturas.length > 0) {
        console.log("\nAgendado para:");
        for (const consulta of consultasFuturas) {
          console.log(`${consulta.data}`);
          console.log(`${this.formatarHora(consulta.horaInicial)} às ${this.formatarHora(consulta.horaFinal)}`);
        }
      }
      console.log("\n------------------------------------------------------------");
    }
  }

  formatarNome(nome) {
    const nomeFormatado = nome.length > 30 ? nome.slice(0, 30) + "..." : nome;
    return nomeFormatado.padEnd(40, " ");
  }

  calcularIdade(dataNascimento) {
    const [dia, mes, ano] = dataNascimento.split('/');
    const dataNasc = new Date(ano, mes - 1, dia);
    const diff = new Date(Date.now() - dataNasc.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  }

  formatarHora(hora) {
    return `${hora.slice(0, 2)}:${hora.slice(2)}`;
  }

  agenda() {
    const option = this.#prompt("Agenda\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal");

    switch (option) {
      case '1':
        this.criaNovaConsulta();
        break;
      case '2':
        this.cancelaConsulta();
        break;
      case '3':
        this.listaConsultas();
        break;
      case '4':
        this.mainMenu();
        break;
      default:
        console.log("Opção inválida, escolha novamente.");
        this.agenda();
        break;
    }
  }

  criaNovaConsulta() {
    const cpf = this.#prompt("Digite o CPF do paciente: ");
    if (!this.pacienteExiste(cpf)) {
      console.log("Paciente não encontrado.");
      return;
    }
    const paciente = this.pacientes.find(p => p.cpf === cpf);

    const data = this.#prompt("Digite a data da consulta (DD/MM/AAAA): ");
    if (!this.validarData(data)) {
      console.log("Data inválida.");
      return;
    }

    const horaInicial = this.#prompt("Digite a hora inicial da consulta (HHMM): ");
    if (!this.validarHora(horaInicial)) {
      console.log("Hora inicial inválida.");
      return;
    }

    const horaFinal = this.#prompt("Digite a hora final da consulta (HHMM): ");
    if (!this.validarHora(horaFinal)) {
      console.log("Hora final inválida.");
      return;
    }

    const consulta = new Consulta(cpf, data, horaInicial, horaFinal);
    if (this.verificarConflitoAgendamento(consulta)) {
      console.log("Conflito de agendamento. Verifique os horários disponíveis.");
      return;
    }

    this.consultas.push(consulta);
    paciente.consultas.push(consulta);

    console.log("Consulta agendada com sucesso.");
  }

  validarData(data) {
    const [dia, mes, ano] = data.split('/');
    const dataFornecida = new Date(ano, mes - 1, dia);
    const dataAtual = new Date();
    return (
      dataFornecida instanceof Date && !isNaN(dataFornecida) &&
      dataFornecida >= dataAtual
    );
  }

  validarHora(hora) {
    const horaValida = /^(0[8-9]|1[0-8])([0-5][05])$/;
    return horaValida.test(hora);
  }
  

  verificarConflitoAgendamento(novaConsulta) {
    for (const consulta of this.consultas) {
      if (consulta.cpf === novaConsulta.cpf && this.isConsultaConflitante(consulta, novaConsulta)) {
        return true;
      }
    }
    return false;
  }

  isConsultaConflitante(consultaExistente, novaConsulta) {
    const [diaConsultaExistente, mesConsultaExistente, anoConsultaExistente] = consultaExistente.data.split('/');
    const [horaInicialConsultaExistente, minutoInicialConsultaExistente] = consultaExistente.horaInicial.match(/\d{2}/g);
    const [horaFinalConsultaExistente, minutoFinalConsultaExistente] = consultaExistente.horaFinal.match(/\d{2}/g);

    const [diaNovaConsulta, mesNovaConsulta, anoNovaConsulta] = novaConsulta.data.split('/');
    const [horaInicialNovaConsulta, minutoInicialNovaConsulta] = novaConsulta.horaInicial.match(/\d{2}/g);
    const [horaFinalNovaConsulta, minutoFinalNovaConsulta] = novaConsulta.horaFinal.match(/\d{2}/g);

    const dataConsultaExistente = new Date(
      anoConsultaExistente, mesConsultaExistente - 1, diaConsultaExistente,
      horaInicialConsultaExistente, minutoInicialConsultaExistente
    );
    const dataFinalConsultaExistente = new Date(
      anoConsultaExistente, mesConsultaExistente - 1, diaConsultaExistente,
      horaFinalConsultaExistente, minutoFinalConsultaExistente
    );
    const dataNovaConsulta = new Date(
      anoNovaConsulta, mesNovaConsulta - 1, diaNovaConsulta,
      horaInicialNovaConsulta, minutoInicialNovaConsulta
    );
    const dataFinalNovaConsulta = new Date(
      anoNovaConsulta, mesNovaConsulta - 1, diaNovaConsulta,
      horaFinalNovaConsulta, minutoFinalNovaConsulta
    );

    return (
      (dataNovaConsulta >= dataConsultaExistente && dataNovaConsulta < dataFinalConsultaExistente) ||
      (dataFinalNovaConsulta > dataConsultaExistente && dataFinalNovaConsulta <= dataFinalConsultaExistente) ||
      (dataNovaConsulta <= dataConsultaExistente && dataFinalNovaConsulta >= dataFinalConsultaExistente)
    );
  }

  cancelaConsulta() {
    const cpf = this.#prompt("Digite o CPF do paciente: ");
    if (!this.pacienteExiste(cpf)) {
      console.log("Paciente não encontrado.");
      return;
    }
    const paciente = this.pacientes.find(p => p.cpf === cpf);

    const data = this.#prompt("Digite a data da consulta (DD/MM/AAAA): ");
    if (!this.validarData(data)) {
      console.log("Data inválida.");
      return;
    }

    const horaInicial = this.#prompt("Digite a hora inicial da consulta (HHMM): ");
    if (!this.validarHora(horaInicial)) {
      console.log("Hora inicial inválida.");
      return;
    }

    const consultaIndex = this.consultas.findIndex(
      c => c.cpf === cpf && c.data === data && c.horaInicial === horaInicial
    );

    if (consultaIndex === -1) {
      console.log("Consulta não encontrada.");
      return;
    }

    const consulta = this.consultas[consultaIndex];
    if (!this.isConsultaFutura(consulta)) {
      console.log("Só é possível cancelar um agendamento futuro.");
      return;
    }

    this.consultas.splice(consultaIndex, 1);
    paciente.consultas = paciente.consultas.filter(
      c => !(c.data === data && c.horaInicial === horaInicial)
    );

    console.log("Consulta cancelada com sucesso.");
  }

  listaConsultas() {
    const option = this.#prompt("Digite 1 para listar toda a agenda ou 2 para listar um período específico: ");
    switch (option) {
      case '1':
        this.exibeAgenda(this.consultas);
        break;
      case '2':
        const dataInicial = this.#prompt("Digite a data inicial (DD/MM/AAAA): ");
        if (!this.validarData(dataInicial)) {
          console.log("Data inicial inválida.");
          return;
        }
        const dataFinal = this.#prompt("Digite a data final (DD/MM/AAAA): ");
        if (!this.validarData(dataFinal)) {
          console.log("Data final inválida.");
          return;
        }
        const consultasPeriodo = this.consultas.filter(
          consulta => this.isDataNoPeriodo(consulta.data, dataInicial, dataFinal)
        );
        this.exibeAgenda(consultasPeriodo);
        break;
      default:
        console.log("Opção inválida, escolha novamente.");
        this.listaConsultas();
        break;
    }
  }

  isDataNoPeriodo(data, dataInicial, dataFinal) {
    const [dia, mes, ano] = data.split('/');
    const dataConsulta = new Date(ano, mes - 1, dia);
    const [diaInicial, mesInicial, anoInicial] = dataInicial.split('/');
    const dataInicialPeriodo = new Date(anoInicial, mesInicial - 1, diaInicial);
    const [diaFinal, mesFinal, anoFinal] = dataFinal.split('/');
    const dataFinalPeriodo = new Date(anoFinal, mesFinal - 1, diaFinal);

    return dataConsulta >= dataInicialPeriodo && dataConsulta <= dataFinalPeriodo;
  }

  exibeAgenda(consultas) {
    consultas.sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split('/');
      const [diaB, mesB, anoB] = b.data.split('/');
      const dataA = new Date(anoA, mesA - 1, diaA, a.horaInicial.slice(0, 2), a.horaInicial.slice(2));
      const dataB = new Date(anoB, mesB - 1, diaB, b.horaInicial.slice(0, 2), b.horaInicial.slice(2));
      return dataA - dataB;
    });

    for (const consulta of consultas) {
      const paciente = this.pacientes.find(p => p.cpf === consulta.cpf);
      console.log(`CPF: ${paciente.cpf}`);
      console.log(`Nome: ${paciente.nome}`);
      console.log(`Data da Consulta: ${consulta.data}`);
      console.log(`Hora Inicial: ${consulta.horaInicial}`);
      console.log(`Hora Final: ${consulta.horaFinal}`);
      console.log("-----------------------");
    }
  }
}

export default Consultorio;
