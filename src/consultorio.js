import PromptSync from 'prompt-sync';

const prompt = PromptSync({ sigint: true });

const consultas = [];
const pacientes = [];

function mainMenu(){
    const option = prompt("Menu principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim\n");

    switch (option){
        case 1:
            cadastroPaciente();
            break;
        case 2:
            agenda();
            break;
        case 3:
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
        case 1:
            cadastraNovoPaciente();
            break;
        case 2:
            excluiPaciente();
            break;
        case 3:
            listaPacientesCPF();
            break;
        case 4:
            listaPacientesNome();
            break;
        case 5:
            mainMenu();
            break;
        default:
            console.log("Opção inválida, escolha novamente.");
            cadastroPaciente();
            break;
    }
}

mainMenu()