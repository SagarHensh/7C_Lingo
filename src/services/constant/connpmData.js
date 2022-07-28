// define all fields for common data

export const COMMON = Object.freeze({
  CLIENT: [
    {
      id: "tru6pftdf5kuz38q56",
      name: "Paul Disney"
    },
    {
      id: "tru6pftdf5kuz38q34",
      name: "Rozer Alfred"
    }
  ],
  SUPERVISOR: [
    {
      id: "tru6pftdf5kuz38a11",
      clientId: "tru6pftdf5kuz38q56",
      name: "Stephen Walter"
    },
    {
      id: "tru6pftdf5kuz38d45",
      clientId: "tru6pftdf5kuz38q56",
      name: "Henry Conner"
    }, {
      id: "tru6pftdf5kuz38b12",
      clientId: "tru6pftdf5kuz38q34",
      name: "Gabriel Lopez"
    },
    {
      id: "tru6pftdf5kuz38c19",
      clientId: "tru6pftdf5kuz38q34",
      name: "Pablo Hichcock"
    }
  ],
  DISPLAY_ARR: [
    // {
    //   label: "10",
    //   value: 10,
    // },
    {
      label: "20",
      value: 20,
    },
    {
      label: "30",
      value: 30,
    },
    {
      label: "40",
      value: 40,
    },
    {
      label: "50",
      value: 50,
    },
  ],
  NOTIFICATION: {
    GENERAL: "GEN",
    REMINDER: "REMIND",
    JOB: "JOB",
    BIRTHDAY: "BIRTH"
  },
  PROJECT_DUMMY_TASK_TRANSLATION: [
    {
      "targetLanguageId": "3",
      "sourceLanguageId": "110",
      "id": 50,
      "documentType": ".docx",
      "documentName": "Doc 1",
      "documentPath": "/images/dummypdf1644822478588.pdf",
      "wordCount": 1000,
      "sourceLanguage": "English",
      "serviceName": "Translation",
      "targetLanguage": "Adja",
      "bidCounter": 0,
      "subTask": []
    },
    {
      "targetLanguageId": "3",
      "sourceLanguageId": "110",
      "id": 51,
      "documentType": ".docx",
      "documentName": "Doc 2",
      "documentPath": "/images/dummyExcel1644822510438.xlsx",
      "wordCount": 1000,
      "sourceLanguage": "English",
      "serviceName": "Voice Over",
      "targetLanguage": "Adja",
      "bidCounter": 0,
      "subTask": []
    }
  ],
  
});