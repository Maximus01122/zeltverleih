import axios from "axios";
import {apiUrl} from "@/services/api";

const EMAIL_API_BASE_URL = apiUrl("/email/receive");

const fetchEmails = async () => {
    return await axios.get(EMAIL_API_BASE_URL);
};

const EmailService = {fetchEmails}
export default EmailService;