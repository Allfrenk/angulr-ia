export const TECH_GLOSSARY: Record<string, string> = {
  // Zoneless & Change Detection
  'provideZonelessChangeDetection()':
    "Rimuove zone.js dal runtime Angular. Senza zone.js il framework non monkey-patcha gli eventi del browser, ma si affida esclusivamente ai signal per sapere quando aggiornare il DOM. Riduce il bundle e migliora l'INP (Interaction to Next Paint).",
  Zoneless:
    'Modalità di Angular senza zone.js. Il change detection parte solo quando un signal cambia valore, non ad ogni evento del browser. Introdotto come stable in Angular 20.2, default in Angular 21.',
  OnPush:
    'Strategia di change detection che limita i controlli al solo albero del componente quando un input cambia o un signal emette. Con Zoneless è la strategia raccomandata per i componenti shared.',

  // Standalone
  Standalone:
    'Componente, direttiva o pipe che non appartiene a nessun NgModule. Dichiara le proprie dipendenze direttamente nel campo imports del decoratore @Component. È il modello default in Angular 14+ e obbligatorio in Angular 21.',

  // Signals
  Signals:
    "Sistema di reattività fine-grained introdotto in Angular 16 e stabilizzato in Angular 20. Un signal è un wrapper attorno a un valore che notifica i consumer quando cambia. Elimina la necessità di zone.js, RxJS e markForCheck per la maggior parte dei casi d'uso.",
  'signal()':
    "Primitiva reattiva di Angular. Contiene un valore e notifica automaticamente i consumer quando cambia. Sostituisce BehaviorSubject per la maggior parte dei casi d'uso di stato locale.",
  'computed()':
    'Signal derivato da altri signal. Si ricalcola automaticamente e in modo lazy solo quando uno dei signal da cui dipende cambia. Equivalente a una formula Excel reattiva.',
  'effect()':
    'Esegue una funzione ogni volta che i signal letti al suo interno cambiano valore. Usato per side effect come aggiornare il DOM, scrivere su localStorage o triggerare chiamate API.',
  'linkedSignal()':
    'Signal scrivibile che si resetta automaticamente quando cambia il suo source signal. Utile per stato locale che dipende da stato globale — ad esempio resettare una search o la pagina corrente quando cambia un filtro.',
  'input()':
    'API signal-based per dichiarare gli input di un componente. Sostituisce il decoratore @Input(). Il valore è direttamente leggibile come signal nel template e nel TS senza subscribe.',
  'model()':
    'Input signal con two-way binding. Sostituisce il pattern @Input() + @Output() EventEmitter per il binding bidirezionale. Usato per componenti controllati come input custom.',
  'viewChild()':
    'API signal-based per accedere a elementi del DOM o componenti figli. Sostituisce @ViewChild(). Restituisce un signal che diventa disponibile dopo il render.',
  'toSignal()':
    "Converte un Observable RxJS in un signal. Gestisce automaticamente la subscription e l'unsubscribe. Permette di usare dati asincroni (es. route params) come signal nel template.",
  'afterRenderEffect()':
    'Effect che viene eseguito dopo che Angular ha aggiornato il DOM. Utile per misurazioni del DOM o integrazioni con librerie third-party che richiedono il DOM aggiornato.',

  // Resource
  'resource()':
    'API Angular 21 per gestire dati asincroni come signal nativi. Espone isLoading(), error() e value() come signal reattivi. Sostituisce il pattern BehaviorSubject + catchError + finalize senza usare RxJS.',
  'isLoading()':
    'Signal booleano esposto da resource(). È true durante il fetch dei dati e false quando la chiamata si completa — con successo o errore. Usato per mostrare skeleton loader nel template.',
  'error()':
    "Signal esposto da resource() che contiene l'eccezione in caso di fetch fallito. Se la chiamata ha successo è undefined. Usato per mostrare messaggi di errore nel template.",

  // NgRx Signals
  SignalStore:
    'Store reattivo di NgRx basato su signal. Alternativa leggera a Redux per la gestione dello stato globale. Si definisce con signalStore() e si compone con withState, withComputed, withMethods.',
  'Signal Store':
    'Store reattivo di NgRx basato su signal. Alternativa leggera a Redux per la gestione dello stato globale. Si definisce con signalStore() e si compone con withState, withComputed, withMethods.',
  'signalStore()':
    'Funzione di NgRx/signals che crea uno store reattivo. Accetta feature functions come withState(), withComputed(), withMethods() per costruire lo store in modo modulare e type-safe.',
  'withState()':
    'Feature di NgRx/signals che dichiara lo stato iniziale dello store. Ogni proprietà diventa automaticamente un signal accessibile sul store.',
  'withComputed()':
    'Feature di NgRx/signals per dichiarare computed signal derivati dallo stato. Equivalente a computed() ma scoped allo store — si aggiornano automaticamente quando lo stato cambia.',
  'withMethods()':
    'Feature di NgRx/signals per dichiarare i metodi che modificano lo stato. I metodi chiamano patchState() per aggiornare lo stato in modo immutabile.',
  'patchState()':
    'Funzione di NgRx/signals per aggiornare lo stato dello store. Accetta un oggetto parziale e lo merge con lo stato corrente in modo immutabile. Equivalente allo spread operator su un oggetto.',
  'dealsByStage Map':
    'computed signal che genera una Map<DealStage, Deal[]> partizionando tutti i deal per stage in un unico passaggio. Ogni colonna kanban legge dalla Map senza ricalcoli indipendenti.',
  'filteredClients computed':
    'computed signal che filtra la lista clienti in base a searchQuery e statusFilter. Si ricalcola automaticamente quando uno dei due signal cambia, senza logica imperativa.',

  // Signal Forms
  'Signal Forms':
    'API sperimentale Angular 21 per la gestione dei form basata su signal. Sostituisce ReactiveFormsModule eliminando subscribe manuali e il pattern takeUntil(destroy$).',
  'form()':
    "Funzione di @angular/forms/signals che crea un FieldTree reattivo da un signal modello. Il FieldTree specchia la struttura del modello e permette l'accesso ai campi con dot notation.",
  FormField:
    'Direttiva di @angular/forms/signals che fa il binding bidirezionale tra un input HTML e un campo del FieldTree. Sostituisce [formControl] di ReactiveFormsModule.',
  'required()':
    'Validatore dichiarativo di Signal Forms. Si applica al campo nel secondo argomento di form() e produce errori reattivi accessibili via field().errors(). Nessun subscribe necessario.',
  'email()':
    'Validatore email di Signal Forms. Verifica il formato email e aggiunge un errore reattivo al field. Combinabile con required() sullo stesso campo.',

  // Template Control Flow
  '@if @else':
    'Nuova sintassi Angular per rendering condizionale. Sostituisce *ngIf con una sintassi più leggibile e type-safe. Supporta type narrowing nella branch @else.',
  '@if / @for':
    'Nuova sintassi built-in Angular per il control flow nel template. @if sostituisce *ngIf, @for sostituisce *ngFor con track obbligatorio. Più performante e type-safe rispetto alle direttive strutturali.',
  '@for @empty':
    "Nuova sintassi Angular per iterazione. Richiede track obbligatorio per l'ottimizzazione del DOM. @empty viene renderizzato quando la collezione è vuota, senza *ngIf aggiuntivi.",
  '@switch':
    'Nuova sintassi Angular per switch condizionale. Sostituisce [ngSwitch] con una sintassi più pulita e senza necessità di import.',
  '@defer':
    'Blocco di lazy rendering dichiarativo di Angular. Il contenuto viene caricato in modo lazy in base al trigger specificato, con @placeholder e @loading per gli stati intermedi.',
  '@defer (on timer)':
    'Trigger di @defer che carica il contenuto dopo un delay specificato. Usato per contenuto secondario che non deve bloccare il rendering principale della pagina.',
  '@defer (on viewport)':
    "Trigger di @defer che carica il contenuto quando l'elemento entra nel viewport. Usato per contenuto below-the-fold — zero rendering se l'utente non scrolla.",
  '@defer on viewport':
    "Trigger di @defer che carica il contenuto quando l'elemento entra nel viewport. Usato per contenuto below-the-fold — zero rendering se l'utente non scrolla.",
  '@placeholder':
    'Contenuto mostrato prima che il blocco @defer venga caricato. Deve essere leggero e non usare import lazy. Può essere un ng-container vuoto o uno skeleton.',
  '@loading':
    'Contenuto mostrato durante il caricamento del blocco @defer. Differisce da @placeholder: appare solo dopo che il loading è iniziato, non prima.',
  '@let':
    'Dichiarazione di variabile locale nel template Angular 21. Evita chiamate ripetute allo stesso signal o expression nel template. Migliora leggibilità e performance.',

  // RxJS
  RxJS: 'Libreria per programmazione reattiva con Observable. In Angular viene usata per stream asincroni come eventi HTTP, route params, form value changes. Con Angular 21 e i signal il suo uso si riduce progressivamente, ma rimane fondamentale per operatori avanzati come debounceTime, distinctUntilChanged e switchMap.',
  'RxJS debounce':
    'Operatore RxJS che emette un valore solo dopo che è passato un intervallo di tempo senza nuove emissioni. Usato nella search per evitare chiamate ad ogni tasto premuto.',
  'debounceTime(300)':
    'Variante di debounce che aspetta 300ms di silenzio prima di emettere. Standard per le search box — bilancia reattività e performance.',
  'distinctUntilChanged()':
    "Operatore RxJS che filtra emissioni consecutive identiche. Evita aggiornamenti inutili quando l'utente cancella e riscrive la stessa stringa. Confronto shallow per default, accetta un comparator custom.",
  'takeUntilDestroyed()':
    'Operatore Angular (non RxJS puro) che completa automaticamente un Observable quando il componente viene distrutto. Rileva il DestroyRef dal contesto di injection corrente. Elimina il boilerplate di OnDestroy + Subject + takeUntil.',
  'FormControl + RxJS':
    'Combinazione classica Angular: FormControl espone valueChanges come Observable RxJS, che viene trasformato con operatori prima di aggiornare lo store. Dimostra interoperabilità tra il mondo Observable e il mondo Signal.',

  // Routing & DI
  RouterLink:
    "Direttiva Angular per la navigazione dichiarativa nel template. Sostituisce href con gestione lato client — nessun reload della pagina. Accetta path come array ['/app/clients'] e queryParams opzionali per passare filtri o parametri alla route di destinazione.",
  queryParams:
    'Parametri URL opzionali passati tramite [queryParams] su RouterLink o router.navigate(). Usati per comunicare stato tra pagine senza store — ad esempio selezionare un filtro nella pagina di destinazione al momento della navigazione.',
  'inject()':
    "Funzione per l'injection delle dipendenze senza costruttore. Funziona in qualsiasi injection context — componenti, direttive, guard, factory function. Sostituisce il pattern constructor(private svc: Service).",
  ActivatedRoute:
    'Servizio Angular che espone i dati della route corrente come Observable. Usato con paramMap per leggere i parametri URL in modo reattivo.',
  'ActivatedRoute.paramMap':
    'Observable che emette ogni volta che i parametri della route cambiano. Convertito in signal con toSignal() per un uso reattivo e dichiarativo nel template.',
  paramMap:
    "Observable di ActivatedRoute che emette ogni volta che i parametri dell'URL cambiano. Usato con map(p => p.get('id')) + toSignal() per derivare l'id del cliente come signal reattivo.",
  'computed() da route param':
    "Pattern Angular 21: toSignal(route.paramMap) + computed() per derivare i dati da mostrare direttamente dall'URL. Zero ngOnInit, zero subscribe, zero gestione manuale.",
  'Lazy Routing':
    "Caricamento lazy dei componenti tramite loadComponent(). Angular scarica il JS del componente solo quando l'utente naviga alla route corrispondente, riducendo il bundle iniziale.",
  'auth guard':
    "CanActivateFn che protegge le route /app/*. Se l'utente non è autenticato viene rediretto alla landing. Legge isAuthenticated() dallo store — signal-based, zero subscribe.",
  'Location.back()':
    "Servizio Angular di @angular/common che naviga alla voce precedente nella history del browser. Equivalente al tasto back del browser — più robusto di router.navigate() hardcoded perché rispetta la history reale dell'utente.",

  // Methods
  'updateClient()':
    "Metodo del ClientsStore che aggiorna un cliente esistente con patchState(). Usa .map() per creare un nuovo array immutabile — il cliente con l'id corrispondente viene sostituito, gli altri rimangono invariati. Dimostra il pattern di aggiornamento immutabile in NgRx Signals.",
  'addDeal()':
    'Metodo del PipelineStore che aggiunge un nuovo deal allo store con patchState(). Usa lo spread operator per creare un nuovo array immutabile. Il deal ottiene un id univoco tramite Date.now().toString().',
  'moveToStage()':
    'Metodo del PipelineStore che sposta un deal in un nuovo stage. Usa patchState() con .map() per aggiornare immutabilmente solo il deal target, lasciando invariati tutti gli altri.',

  // UI Patterns
  'drag-to-scroll':
    'Pattern UX per scorrere contenuto orizzontale con il drag del mouse. Implementato con mousedown/mousemove/mouseup e viewChild<ElementRef>() per accedere al container nativo. isDragging è un signal locale che coordina lo stato del drag senza logica asincrona.',
  'immutable state update':
    'Pattern di aggiornamento stato senza mutazione diretta. Con patchState() si passa un oggetto parziale che viene merged — .map() crea un nuovo array invece di modificare quello esistente.',
  'readonly state':
    "Signal con valore fisso non modificabile dall'utente. Usato nel login per le credenziali pre-compilate — dimostra come Signal Forms gestisce campi in sola lettura.",
  'showPassword toggle':
    "Pattern common per input password: signal booleano che alterna il type dell'input tra password e text. computed() deriva il tipo dall'input rendendo il template dichiarativo.",
  isLoading:
    "Signal booleano per gestire lo stato di caricamento di un'operazione asincrona. Disabilita il bottone di submit e mostra feedback visivo durante l'attesa.",
  'pagination signal':
    'Paginazione implementata con signal puri. currentPage è un linkedSignal che si resetta a 1 automaticamente quando cambia il filtro o la search — evitando di mostrare una pagina inesistente dopo un cambio di contesto.',
};
