const axios = require('axios');

const BASE_URL = process.env.NIBSS_BASE_URL;
const API_KEY = process.env.NIBSS_API_KEY;
const API_SECRET = process.env.NIBSS_API_SECRET;

//cache token in memory
let token = null;
let tokenExpiry = null;

const getNIBSSToken = async () => {
    //return cached token if valid
    if (token && tokenExpiry && new Date() < tokenExpiry) {
        return token;
    }
    try {
        const response = await axios.post(`${BASE_URL}/auth/token`, {
            apiKey: API_KEY,
            apiSecret: API_SECRET
        }, { timeout: 15000 });

        token = response.data.token;
        //cache for 55 minutes to be safe
        tokenExpiry = new Date(Date.now() + response.data.expiresIn + 55 * 60 * 1000);
        return token;
    } catch (error) {
        console.error('Error fetching NIBSS token:', error);
        throw error;
    }
};

const token = getNIBSSToken;

const nibssclient = async () => {
    const token = await getNIBSSToken();
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

//insert a fake bvn for testing
const insertBVN = async (bvnData) => {
    try {
        const client = await nibssclient();
        const response = await client.post('/bvn/insert', bvnData, { timeout: 15000 });
        return response.data;
    } catch (error) {
        console.error('Error inserting BVN:', error);
        throw error;
    }
};

//validate a bvn
const validateBVN = async (bvn) => {
        const client = await nibssclient();
        const response = await client.get(`/bvn/validate/${bvn}`, { timeout: 15000 });
        return response.data;
};

//insert fake nin for testing
const insertNIN = async (ninData) => {
    const client = await nibssclient();
    const response = await client.post('/nin/insert', ninData, { timeout: 15000 });
    return response.data;
};

//validate a nin
const validateNIN = async (nin) => {
    const client = await nibssclient();
    const response = await client.get(`/nin/validate/${nin}`, { timeout: 15000 });
    return response.data;
};
//get all fintechs
const getFintechs = async () => {
    const client = await nibssclient();
    const response = await client.get('/fintechs', { timeout: 15000 });
    return response.data;
};

//onboard fintech with Nibss 
const onboardFintech = async ( name, email ) => {
    const client = await nibssclient();
    const response = await client.post('/fintech/onboard', { name, email }, { timeout: 15000 });
    return response.data;
};

//create bank account via kyc
const createBankAccount = async (accountData) => {
    const client = await nibssclient();
    const response = await client.post('/bankaccount/create', accountData, { timeout: 15000 });
    return response.data;
};

//name enquiry
const nameEnquiry = async (accountNumber, bankCode) => {
    const client = await nibssclient();
    const response = await client.get(`/nameenquiry?accountNumber=${accountNumber}&bankCode=${bankCode}`, { timeout: 15000 });
    return response.data;
};

const gettransaction = async (ref) => {
    const client = await nibssclient();
    const response = await client.get(`/transaction/${ref}`, { timeout: 15000 });
    return response.data;
};

//get account balance
const getAcccountBalance = async (accountNumber) => {
    const client = await nibssclient();
    const response = await client.get(`/accountbalance/${accountNumber}`, { timeout: 15000 });
    return response.data;
};

module.exports = {
    insertBVN,
    validateBVN,
    insertNIN,
    validateNIN,
    getFintechs,
    onboardFintech,
    createBankAccount,
    nameEnquiry,
    gettransaction,
    getAcccountBalance
};
