import PromptSync from 'prompt-sync';
import format from 'date-fns/format';
import Paciente from './paciente';
import { isValid as isValidCPF } from 'cpf';


const prompt = PromptSync({ sigint: true });

const consultas = [];
const pacientes = [];

function mainMenu(){
    const option = prompt("Menu principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim\n");

    switch (option) {
        case '1':
          cadastroPaciente();
          break;
        case '2':
          agenda();
          break;
        case '3':
          break;
        default:
          console.log("Opção inválida, escolha novamente.");
          mainMenu();
          break;
    }
}

function cadastroPaciente(){
    const option = prompt("Menu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal");

    switch (option){
        case '1':
            cadastraNovoPaciente();
            break;
          case '2':
            excluiPaciente();
            break;
          case '3':
            listaPacientesCPF();
            break;
          case '4':
            listaPacientesNome();
            break;
          case '5':
            mainMenu();
            break;
          default:
            console.log("Opção inválida, escolha novamente.");
            cadastroPaciente();
            break;
    }

    function cadastraNovoPaciente(){
        const nome = prompt("Insira seu nome: ");
        const cpf = prompt("Insire seu cpf: ");
        const data = prompt("Insira sua data de nascimento no format DD/MM/AAAA: ");
        if (!validaNome(nome)){
            console.log("Seu nome precisa ter 5 ou mais caracteres.")
            return false;
        } else if (!validaCPF(cpf)){
            console.log("CPF inválido.");
            return false;
        } else if (!validarDataNascimento(data)){
            console.log("Sua data de nascimento precisa estar no formato DD/MM/AAAA e você precisar ter 13 anos ou mais.");
            return false;
        } else {
            pacientes.push(new Paciente(cpf, nome, format(new Date(data), "dd/MM/yyyy")))
            return true;
        }
    }

    function validarDataNascimento(dataNascimento) {
        const dataAtual = new Date();
        const partesData = dataNascimento.split('/');
        const dia = parseInt(partesData[0]);
        const mes = parseInt(partesData[1]) - 1;
        const ano = parseInt(partesData[2]);
        const dataFornecida = new Date(ano, mes, dia);
        return (dataAtual - dataFornecida) / (1000 * 60 * 60 * 24 * 365) >= 13;
    }

    function validaNome(nome) {
        return nome.length >= 5;
    }
    
    function validaCPF(cpf) {
        return isValidCPF(cpf);
    }
}

mainMenu()