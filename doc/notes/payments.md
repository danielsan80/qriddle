> metti che voglia aggiungere un modo per farmi offrire una birra/un caffé da chi usa e apprezza questo servizio. Cosa dovrei fare?

● Le opzioni più comuni per ricevere donazioni su progetti open source:

Servizi di donazione

1. Buy Me a Coffee (buymeacoffee.com)                                                                                                                                                                                               
   - Semplice, interfaccia amichevole                                                                                                                                                                                                
   - Commissioni ~5% + fee processamento                                                                                                                                                                                             
   - Widget/bottone da integrare
2. Ko-fi (ko-fi.com)                                                                                                                                                                                                                
   - Simile a BMC, zero commissioni sui tip (solo fee PayPal/Stripe)                                                                                                                                                                 
   - Supporta anche membership e shop
3. GitHub Sponsors                                                                                                                                                                                                                  
   - Integrato con GitHub, zero commissioni                                                                                                                                                                                          
   - Richiede approvazione (qualche giorno)                                                                                                                                                                                          
   - Badge visibile sul profilo/repo
4. PayPal.me                                                                                                                                                                                                                        
   - Link diretto: paypal.me/tuousername                                                                                                                                                                                             
   - Nessun setup, commissioni standard PayPal
5. Stripe Payment Links                                                                                                                                                                                                             
   - Professionale, commissioni standard (~2.9%)                                                                                                                                                                                     
   - Richiede account Stripe

Implementazione pratica

L'integrazione più semplice è aggiungere un link/bottone nel footer o header dell'app:

  <a href="https://buymeacoffee.com/tuousername" target="_blank">                                                                                                                                                                     
    ☕ Offrimi un caffè                                                                                                                                                                                                               
  </a>                                                                                                                                                                                                                                

Oppure un'icona discreta nell'interfaccia.

Consiglio

Ko-fi o Buy Me a Coffee sono i più adatti per progetti piccoli: setup in 5 minuti, widget pronti, nessuna burocrazia.

Se preferisci restare nell'ecosistema GitHub, GitHub Sponsors è l'opzione più "pulita" ma richiede qualche giorno per l'attivazione.

Vuoi che integri uno di questi nel progetto?       


> in payment.md ti ho scritto la risposta che mi hai dato prima. Mi sai dire se posso vendere anziché ottenere donazioni con questi servizi? Che obblichi fiscali ho per farlo?

● Read(doc/payments/payments.md)                                                                                                                                                                                                      
⎿  Read 41 lines

● Domanda importante. Ti do informazioni generali, ma per questioni fiscali consulta un commercialista.

Donazioni vs Vendita

Donazione (liberalità): chi dona non riceve nulla in cambio. È un regalo.

Vendita: c'è uno scambio (prodotto/servizio ↔ denaro). Cambia tutto dal punto di vista fiscale.

I servizi supportano la vendita?                                                                                                                                                                                                    
┌─────────────────┬───────────────────────────┐                                                                                                                                                                                     
│    Servizio     │     Vendita prodotti      │                                                                                                                                                                                     
├─────────────────┼───────────────────────────┤                                                                                                                                                                                     
│ Ko-fi           │ Sì (shop integrato)       │                                                                                                                                                                                     
├─────────────────┼───────────────────────────┤                                                                                                                                                                                     
│ Buy Me a Coffee │ Sì (extras, membership)   │                                                                                                                                                                                     
├─────────────────┼───────────────────────────┤                                                                                                                                                                                     
│ GitHub Sponsors │ No, solo sponsorizzazioni │                                                                                                                                                                                     
├─────────────────┼───────────────────────────┤                                                                                                                                                                                     
│ PayPal          │ Sì                        │                                                                                                                                                                                     
├─────────────────┼───────────────────────────┤                                                                                                                                                                                     
│ Stripe          │ Sì                        │                                                                                                                                                                                     
└─────────────────┴───────────────────────────┘                                                                                                                                                                                     
Obblighi fiscali in Italia (linee generali)

Se vendi occasionalmente (< 5.000€/anno)

- Niente partita IVA
- Dichiari come "redditi diversi" nel 730/Unico
- Emetti ricevuta per prestazione occasionale

Se vendi con continuità o superi le soglie

- Partita IVA obbligatoria
- Regime forfettario possibile (5% o 15% di tasse, semplificato)
- Fatturazione elettronica
- Se vendi a consumatori UE: regime OSS per l'IVA

Vendita di prodotti digitali

- L'IVA si applica nel paese dell'acquirente (per B2C in UE)
- Servizi come Gumroad, Paddle, Lemon Squeezy gestiscono l'IVA per te (agiscono da "merchant of record")

Consiglio pratico

Se vuoi vendere qualcosa (PDF, template, servizio):
1. Inizia come attività occasionale se i volumi sono bassi
2. Valuta Lemon Squeezy o Paddle che gestiscono IVA e fatturazione per te
3. Parla con un commercialista prima di iniziare — ti costa meno che sistemare errori dopo

Vuoi che ti dia più dettagli su un aspetto specifico?

> Se qriddle diventasse una wizard alla fine della quale tu possa scaricare il tuo pdf personalizzato pagandolo pochi 2 euro. Posso usare Lemon Sqeezy o Paddle? Ho già partita iva ma come consulente IT.

● Sì, entrambi funzionano per questo caso d'uso. Qualche considerazione:

Lemon Squeezy vs Paddle per micro-vendite                                                                                                                                                                                           
┌────────────────────┬───────────────┬────────────────┐                                                                                                                                                                             
│                    │ Lemon Squeezy │     Paddle     │                                                                                                                                                                             
├────────────────────┼───────────────┼────────────────┤                                                                                                                                                                             
│ Commissioni        │ 5% + $0.50    │ 5% + $0.50     │                                                                                                                                                                             
├────────────────────┼───────────────┼────────────────┤                                                                                                                                                                             
│ Su 2€              │ ~0.60€ (30%)  │ ~0.60€ (30%)   │                                                                                                                                                                             
├────────────────────┼───────────────┼────────────────┤                                                                                                                                                                             
│ Merchant of Record │ Sì            │ Sì             │                                                                                                                                                                             
├────────────────────┼───────────────┼────────────────┤                                                                                                                                                                             
│ Setup              │ Semplice      │ Più enterprise │                                                                                                                                                                             
└────────────────────┴───────────────┴────────────────┘                                                                                                                                                                             
Problema: a 2€ le commissioni fisse pesano molto. Ti restano ~1.40€.

Alternative:
- Stripe (2.9% + 0.25€) → ti restano ~1.69€, ma gestisci tu IVA/fatture
- Alzare il prezzo a 3-5€ → commissioni meno impattanti in percentuale

Aspetto fiscale con P.IVA esistente

Verifica col commercialista:

1. Codice ATECO — La consulenza IT (es. 62.02.00) potrebbe non coprire la vendita di prodotti digitali. Potresti dover aggiungere un codice (es. 47.91.10 per commercio elettronico)
2. Merchant of Record — Con Lemon Squeezy/Paddle, tecnicamente loro vendono al cliente e tu ricevi un compenso. Questo semplifica l'IVA ma il commercialista deve sapere come inquadrarlo (fattura estera? autofattura?)
3. Regime forfettario — Se sei in forfettario, verifica i limiti e se questo tipo di ricavi è compatibile

In pratica

Tecnicamente puoi partire domani con Lemon Squeezy. Ma prima:
- 5 minuti col commercialista per confermare codice ATECO e trattamento contabile
- Valuta se 2€ ha senso economicamente dopo le commissioni

Vuoi che esplori l'integrazione tecnica con Lemon Squeezy?      

> se invece la imposto come donazione, quindi io regalo il risultato e tu mi regali 2 euro, che obblighi ho?

● Dipende da come strutturi il flusso.

Donazione vera (PDF gratis, donazione opzionale)

Utente → genera PDF → scarica gratis → (opzionale) dona 2€

Obblighi: praticamente nessuno per importi modesti.

- Le donazioni ricevute da privati non sono reddito imponibile per chi le riceve
- Non servono fatture né ricevute
- Non c'entra con la tua P.IVA (è un regalo personale a te)
- Ko-fi, Buy Me a Coffee, PayPal.me vanno bene

Attenzione: se i volumi diventano significativi e regolari, l'Agenzia delle Entrate potrebbe riqualificarli come reddito. Ma per qualche centinaio di euro l'anno da un progetto hobby, non è un problema realistico.

Donazione finta (PDF solo se paghi)

Utente → genera PDF → paga 2€ → scarica

Questa è una vendita, indipendentemente da come la chiami. Il fisco guarda la sostanza, non l'etichetta.

In pratica

Se vuoi zero burocrazia:
- PDF scaricabile gratis
- Bottone "Offrimi un caffè" con Ko-fi o simile
- Le donazioni restano donazioni

Se vuoi monetizzare seriamente, allora vendita con Lemon Squeezy e verifica col commercialista.

La differenza chiave: il download è condizionato al pagamento? Sì → vendita. No → donazione.                                                                                                                                        
                                                                                                   