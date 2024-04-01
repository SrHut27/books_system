addEventListener('DOMContentLoaded', () => {
    const navButtonCad = document.getElementById('cadButton');
    navButtonCad.addEventListener('click', async () => {
        try {
            const response = await fetch('/clear-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            if (response.ok) {
                console.log('Mensagens limpas com sucesso!');
                // Atualizar a página ou fazer qualquer outra ação necessária após limpar as mensagens
            } else {
                console.error('Erro ao limpar as mensagens:', response.status);
            }
        } catch (error) {
            console.error('Erro ao limpar as mensagens:', error);
        }
        document.getElementById("cancelButton").addEventListener("click", function() {
            window.location.href = "{{req.session.currentURL}}";
        });
    });

});
