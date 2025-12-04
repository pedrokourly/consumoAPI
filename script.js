const API_URL = 'http://localhost:3000/alunos'; //verificar se está correto

//Selecionar os elementos do frontend
const alunosList = document.getElementById("alunos-list");
const form = document.getElementById("aluno-form");
const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const cursoInput = document.getElementById("curso");
const submitBtn = document.getElementById("submit-btn");

// Variável para controlar se estamos editando
let alunoEditandoId = null;
//Funções
//Função para criar ou atualizar um registro
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAluno = {
        nome: nomeInput.value,
        idade: parseInt(idadeInput.value),
        curso: cursoInput.value,
    }

    if (alunoEditandoId) {
        // Modo de edição - envia PUT
        await fetch(`${API_URL}/${alunoEditandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAluno),
        });
        
        // Resetar o modo de edição
        alunoEditandoId = null;
        submitBtn.textContent = "Adicionar";
        submitBtn.classList.remove("editando");
    } else {
        // Modo de criação - envia POST
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAluno),
        });
    }

    nomeInput.value = "";
    idadeInput.value = "";
    cursoInput.value = "";
    carregarAlunos();
});

//Função para listar os registros já criados
async function carregarAlunos() {
    const res = await fetch(API_URL); //Extender a sintaxe do fetch api
    const alunos = await res.json();

    alunosList.innerHTML = "";

    alunos.forEach(aluno => {
        const li = document.createElement("li");
        li.innerHTML = `
        <span>${aluno.nome} (${aluno.idade} anos) <br><span class='curso'>${aluno.curso}</span></span>
        <div class="actions">
            <button class="editar" onclick="atualizarAluno('${aluno._id}')">Editar</button>
            <button class="excluir" onclick="deletarAluno('${aluno._id}')">Excluir</button>
        </div>
        `;
        alunosList.appendChild(li);
    });
}


//Função para apagar um registro
async function deletarAluno(id) {
    // console.log(id);
    let text = "Deseja realmente apagar o registro?";

    if (confirm(text) == true) {
        await fetch(`${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );
        carregarAlunos();
    } else {

    }
}
//Função para atualizar um registro
async function atualizarAluno(id) {
    const res = await fetch(`${API_URL}/${id}`); 
    const aluno = await res.json();
    
    // Preencher o formulário com os dados do aluno
    nomeInput.value = aluno.nome;
    idadeInput.value = aluno.idade;
    cursoInput.value = aluno.curso;
    
    // Ativar modo de edição
    alunoEditandoId = id;
    submitBtn.textContent = "Atualizar";
    submitBtn.classList.add("editando");
    
    // Rolar para o topo para ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//Chamar a função para listar os alunos
carregarAlunos();