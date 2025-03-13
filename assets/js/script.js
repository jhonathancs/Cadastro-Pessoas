// Classe que representa uma pessoa cadastrada, armazenando seus dados
class Pessoa {
    constructor(nome, sobrenome, dataNascimento, email, contato, telefone, cargo) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.contato = contato;
        this.telefone = telefone;
        this.cargo = cargo;
    }
}

// Classe responsável por gerenciar os cadastros e interações com o formulário e filtros
class GerenciadorCadastros {
    // Construtor que inicializa o array de cadastros e atualiza o contador inicial
    constructor() {
        this.cadastros = []; // Array para armazenar todas as pessoas cadastradas
        this.atualizarContador(); // Define o contador inicial como 0
    }

    // Inicia o evento de cadastro ao submeter o formulário
    iniciarCadastro() {
        const form = document.querySelector("#form-cadastro"); // Seleciona o formulário
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            const dados = this.coletarDadosFormulario(); // Coleta os dados inseridos

            if (!this.validarDados(dados)) return; // Valida os dados; retorna se inválido

            // Cria uma nova instância de Pessoa com os dados coletados
            const novaPessoa = new Pessoa(
                dados.nome,
                dados.sobrenome,
                dados.dataNascimento,
                dados.email,
                dados.contato,
                dados.telefone,
                dados.cargo
            );

            // Verifica se o email já existe no array de cadastros
            if (this.emailJaExiste(dados.email)) {
                window.alert("Esse email já existe!"); // Alerta se houver duplicata
                return;
            }

            this.cadastros.push(novaPessoa); // Adiciona a nova pessoa ao array
            UI.criarItemLista(novaPessoa, this); // Cria o item na interface
            this.atualizarContador(); // Atualiza o contador de cadastrados
            form.reset(); // Limpa o formulário após o cadastro
        });
    }

    // Inicia o evento de filtro ao clicar no botão "Pesquisar"
    iniciarFiltro() {
        const btnFiltrar = document.querySelector("#btn"); // Seleciona o botão de filtro
        btnFiltrar.addEventListener("click", () => {
            const cargoValue = document.querySelector("#cargoOption").value; // Pega o valor do filtro
            const listaDeAlunos = document.querySelector("#lista-de-alunos"); // Seleciona a lista
            listaDeAlunos.innerHTML = ""; // Limpa a lista antes de recriar

            // Filtra os cadastros com base no cargo selecionado
            const filtrados = this.cadastros.filter(pessoa => 
                cargoValue === "Todos" || pessoa.cargo === cargoValue
            );

            // Recria os itens filtrados na interface
            filtrados.forEach(pessoa => UI.criarItemLista(pessoa, this));
        });
    }

    // Coleta os valores dos campos do formulário e os retorna como objeto
    coletarDadosFormulario() {
        return {
            nome: document.querySelector("#nome").value.trim(),
            sobrenome: document.querySelector("#sobrenome").value.trim(),
            dataNascimento: document.querySelector("#data-nascimento").value,
            email: document.querySelector("#email").value.trim(),
            contato: document.querySelector("#contato").value.trim(),
            telefone: document.querySelector("#telefone").value.trim(),
            cargo: document.querySelector("#cargo").value.trim()
        };
    }

    // Valida os dados coletados, verificando campos obrigatórios e formato de email
    validarDados(dados) {
        if (!dados.nome || !dados.email || !dados.cargo) {
            window.alert("Por favor, preencha os campos obrigatórios: Nome, Email e Cargo.");
            return false; // Retorna falso se campos obrigatórios estiverem vazios
        }
        if (!dados.email.includes("@")) {
            window.alert("Email inválido!");
            return false; // Retorna falso se o email não tiver "@"
        }
        return true; // Retorna verdadeiro se os dados forem válidos
    }

    // Verifica se um email já existe no array de cadastros
    emailJaExiste(email) {
        return this.cadastros.some(pessoa => pessoa.email === email); // Retorna true se o email já existir
    }

    // Atualiza o contador de total de cadastrados na interface
    atualizarContador() {
        document.querySelector("#total-alunos").textContent = this.cadastros.length; // Define o texto do contador
    }

    // Remove uma pessoa do array de cadastros com base no email
    apagarPessoa(email) {
        this.cadastros = this.cadastros.filter(pessoa => pessoa.email !== email); // Filtra para remover a pessoa
        this.atualizarContador(); // Atualiza o contador após a exclusão
        this.atualizarLista(); // Recarrega a lista na interface
    }

    // Atualiza a lista de cadastros na interface, respeitando o filtro atual
    atualizarLista() {
        const listaDeAlunos = document.querySelector("#lista-de-alunos"); // Seleciona a lista
        const cargoValue = document.querySelector("#cargoOption").value; // Pega o valor do filtro atual
        listaDeAlunos.innerHTML = ""; // Limpa a lista antes de recriar

        // Filtra os cadastros com base no cargo selecionado
        const filtrados = this.cadastros.filter(pessoa => 
            cargoValue === "Todos" || pessoa.cargo === cargoValue
        );

        // Recria os itens filtrados na interface
        filtrados.forEach(pessoa => UI.criarItemLista(pessoa, this));
    }
}

// Classe responsável por manipular a interface do usuário (UI)
class UI {
    // Cria um item na lista de cadastros com os dados da pessoa e um botão de apagar
    static criarItemLista(pessoa, gerenciador) {
        const painelCadastro = document.querySelector("#lista-de-alunos"); // Seleciona o container da lista
        const liCadastro = document.createElement("li"); // Cria um novo elemento <li>
        liCadastro.innerHTML = `
            <h2>Nome: ${pessoa.nome}</h2>
            <h3>Sobrenome: ${pessoa.sobrenome}</h3>
            <p>Email: ${pessoa.email}</p>
            <p>Cargo: ${pessoa.cargo}</p>
            <button class="btn-apagar" data-email="${pessoa.email}">Apagar</button>
        `;
        painelCadastro.appendChild(liCadastro); // Adiciona o item à lista

        // Adiciona um evento ao botão de apagar
        const btnApagar = liCadastro.querySelector(".btn-apagar"); // Seleciona o botão de apagar
        btnApagar.addEventListener("click", () => {
            if (confirm("Tem certeza que deseja apagar este cadastro?")) { // Confirmação antes de apagar
                gerenciador.apagarPessoa(pessoa.email); // Chama a função de apagar no gerenciador
            }
        });
    }
}

// Instancia o gerenciador e inicia as funcionalidades
const gerenciador = new GerenciadorCadastros();
gerenciador.iniciarCadastro(); // Configura o evento de cadastro
gerenciador.iniciarFiltro(); // Configura o evento de filtro