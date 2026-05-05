# Security Spec - Conquista App

1. **Invariantes:**
   - Cada venda (/vendas) e oportunidade (/opportunities) é vinculada estritamente ao `vendedorId` (request.auth.uid).
   - A leitura e escrita são limitadas apenas ao dono do documento.

2. **Cenários Críticos:**
   - Usuário A tentando ler /vendas de Usuário B.
   - Usuário A tentando gravar venda como Usuário B.
   - Tentativa de alterar o `vendedorId` em um update.
