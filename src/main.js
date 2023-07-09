import PromptSync from 'prompt-sync';

const prompt = PromptSync({ sigint: true });

function mainMenu(){
    const option = prompt("Menu principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim\n");

    switch (option){
        default:
            console.log("Opção inválida, escolha novamente.");
            mainMenu();
            break;
    }
}

mainMenu()