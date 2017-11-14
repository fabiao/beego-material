import axios from 'axios'

export class FetchState {
    constructor(name, message) {
        this.name = name
        this.message = message
        this.data = null
    }
}

FetchState.prototype = Object.create(Error.prototype)
FetchState.prototype.name = 'FetchState'

export const FetchCode = {
    SUCCESS: 'SUCCESS',
    INVALID_REQUEST: 'INVALID_REQUEST',
    AUTH_FAILED: 'AUTH_FAILED',
    TIMEOUT_OCCURRED: 'TIMEOUT_OCCURRED',
    ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
    RESOURCES_EXAUSTED: 'RESOURCES_EXAUSTED',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

const mapFetchState = (code) => {
    if (code >= 200 && code <= 399) {
        return new FetchState(FetchCode.SUCCESS, 'Ok')
    }

    switch(code) {
        case 400:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Richiesta non valida')
        case 401:
            return new FetchState(FetchCode.AUTH_FAILED, 'Autenticazione fallita o non processabile')
        case 403:
            return new FetchState(FetchCode.AUTH_FAILED, 'Autenticazione rifiutata dal server')
        case 404:
            return new FetchState(FetchCode.ITEM_NOT_FOUND, 'Risorsa attualmente non trovata')
        case 405:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Richiesta eseguita usando un metodo non permesso')
        case 406:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Contenuti generabili non in conformità con la richiesta')
        case 407:
            return new FetchState(FetchCode.AUTH_FAILED, 'Richiesta autenticazione proxy')
        case 408:
            return new FetchState(FetchCode.TIMEOUT_OCCURRED, 'Tempo per inviare la richiesta scaduto')
        case 409:
            return new FetchState(FetchCode.INVALID_REQUEST, 'La richiesta non può essere portata a termine a causa di un conflitto con lo stato attuale della risorsa')
        case 410:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Risorsa richiesta non più disponibile')
        case 411:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Dimensione richiesta non specificata')
        case 413:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Richiesta troppo grande per le capacità del server')
        case 414:
            return new FetchState(FetchCode.INVALID_REQUEST, 'URI troppo lungo')
        case 415:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Tipo di media richiesto non accettato dal server o dalla risorsa')
        case 420:
            return new FetchState(FetchCode.RESOURCES_EXAUSTED, 'Limite richieste esaurito')
        case 422:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Sintassi della richiesta corretta, ma il server non è in grado di processare le istruzioni contenute')
        case 426:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Protocollo del client obsoleto, necessario aggiornamento (es TPL)')
        case 449:
            return new FetchState(FetchCode.INVALID_REQUEST, 'The request should be retried after doing the appropriate action')
        case 451:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Non disponibile per ragioni legali')
        case 500:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Errore generico')
        case 501:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Il server non è in grado di soddisfare il metodo della richiesta')
        case 502:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Gateway non valido')
        case 503:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Il server non è al momento disponibile')
        case 504:
            return new FetchState(FetchCode.TIMEOUT_OCCURRED, 'Timeout del gateway scaduto')
        case 505:
            return new FetchState(FetchCode.INVALID_REQUEST, 'Il server non supporta la versione HTTP della richiesta')
        default:
            break
    }

    return new FetchState(FetchCode.INVALID_REQUEST, 'Codice errore HTTP non supportato')
}

const publicRequest = axios.create({
    headers: {'Content-Type': 'application/json'}
})

const performRequest = async (method, url, params, request) => {
    const body = method === 'get' ? 'params' : 'data'
    const config = {
        method,
        url,
        [body]: params || {}
    }

    let fetchState = new FetchState(FetchCode.UNKNOWN_ERROR, 'Unexpected exception thrown')
    try {
        const response = await request.request(config)
        fetchState = mapFetchState(response.status)
        fetchState.data = response.data
        if ((response.status === 500 || response.status === 409) && response.data.error !== undefined) {
            fetchState.message = response.data.error
        }
    }
    catch (ex) {
        fetchState.name = ex.response.status
        fetchState.message = ex.response.statusText
        fetchState.data = ex.response.data
    }

    return fetchState
}

const performPublicRequest = (method, url, params) => {
    return performRequest(method, url, params, publicRequest)
}

const authRequest = axios.create({
    headers: {'Content-Type': 'application/json'}
})

export const setAuthRequestToken = (token) => {
    authRequest.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export const performAuthRequest = async (method, url, params) => {
    return performRequest(method, url, params, authRequest)
}

// Public interface
export const get = (url, params) => {
    return performPublicRequest('GET', url, params)
}

export const post = (url, data) => {
    return performPublicRequest('POST', url, data)
}

export const put = (url, data) => {
    return performPublicRequest('PUT', url, data)
}

export const del = (url, data) => {
    return performPublicRequest('DELETE', url, data)
}

// Auth interface
export const getAuth = (url, params) => {
    return performAuthRequest('GET', url, params)
}

export const postAuth = (url, data) => {
    return performAuthRequest('POST', url, data)
}

export const putAuth = (url, data) => {
    return performAuthRequest('PUT', url, data)
}

export const delAuth = (url, data) => {
    return performAuthRequest('DELETE', url, data)
}