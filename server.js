import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './backend/backend_cadastro.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Endpoint de cadastro
app.post('/cadastro', async (req, res) => {
  try {
    const { nome, sobrenome, email, senha } = req.body;

    if (!nome || !sobrenome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verifica se email já existe
    const { data: existingUser } = await supabase
      .from('viajantes')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Insere novo usuário
    const { data, error } = await supabase
      .from('viajantes')
      .insert([
        {
          nome: `${nome} ${sobrenome}`,
          nome_usuario: { nome, sobrenome },
          password: { senha },
          email: email,
          sexo: 'não informado',
          idade: 0
        }
      ])
      .select();

    if (error) throw error;

    res.status(200).json({ 
      message: 'Cadastro realizado com sucesso!', 
      data 
    });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ 
      error: 'Erro ao cadastrar usuário', 
      details: err.message 
    });
  }
});

// Rota raiz → abre o cadastro.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'cadastro.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
