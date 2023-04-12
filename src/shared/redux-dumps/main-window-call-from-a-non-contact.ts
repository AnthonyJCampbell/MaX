// Copyright 2021 Metaswitch Networks - Highly Confidential Material

import { ClickToDialType, CallManagerType, BGLineType } from "protobuf-wispa/dist/settings";
import { StoreState } from "store/types";
import { ModalPopupTypes } from "../../types";
import { WindowTypes } from "../types";

export const NonContactCallDetailsReduxState: StoreState = {
  activeCallsReducer: {
    activeCalls: [],
  },
  callHistoryReducer: {
    historicCalls: [
      {
        uid: "c5023d0f-7458-47f6-934b-1408a4250811",
        remoteParty: "2345557800",
        datetimeStarted: "2021-05-20T15:02:10.704",
        duration: 7,
        type: 1,
        attention: false,
        displayName: "2345557800",
      },
      {
        uid: "4c2b4323-88e0-4d3f-a695-bbc9d6bd0f36",
        remoteParty: "2345557899",
        datetimeStarted: "2021-05-20T15:01:17.932",
        duration: 5,
        type: 1,
        attention: false,
        displayName: "2345557899",
      },
      {
        uid: "9079b776-c9a3-4749-9636-ff97a292e485",
        remoteParty: "123456789",
        datetimeStarted: "2021-05-20T14:57:25.032",
        duration: 4,
        type: 1,
        attention: false,
        displayName: "123456789",
      },
      {
        uid: "7088bf24-a2e2-483e-970f-774ffdf7f227",
        remoteParty: "987654321",
        datetimeStarted: "2021-05-19T18:41:30.329",
        duration: 4,
        type: 1,
        attention: false,
        displayName: "987654321",
      },
      {
        uid: "856d6e68-6f2b-4623-a6e2-6ab8f34400cf",
        remoteParty: "123456789",
        datetimeStarted: "2021-05-19T18:41:09.794",
        duration: 11,
        type: 1,
        attention: false,
        displayName: "123456789",
      },
      {
        uid: "8a6a3414-cf99-488b-ab46-6673058fea0e",
        remoteParty: "2345557822",
        datetimeStarted: "2021-05-11T13:13:35.000",
        duration: 0,
        type: 2,
        attention: false,
        displayName: "2345557822",
      },
      {
        uid: "38dcc2f5-5065-4c1f-a7c6-0774aff37487",
        remoteParty: "2345550282",
        datetimeStarted: "2021-05-11T13:11:55.000",
        duration: 0,
        type: 2,
        attention: false,
        displayName: "2345550282",
      },
      {
        uid: "3a47f349-a327-43c4-9bb4-b390a674513f",
        remoteParty: "2345550282",
        datetimeStarted: "2021-05-11T13:11:45.000",
        duration: 0,
        type: 2,
        attention: false,
        displayName: "2345550282",
      },
      {
        uid: "39d67716-73b7-4a88-9267-ceac335dc7c2",
        remoteParty: "2345557800",
        datetimeStarted: "2021-05-10T12:15:13.000",
        duration: 10,
        type: 1,
        attention: false,
        displayName: "2345557800",
      },
      {
        uid: "5ac5fb31-8de5-4ae2-a231-19eae016e7c6",
        remoteParty: "2345557818",
        datetimeStarted: "2021-04-29T17:13:05.000",
        duration: 0,
        type: 2,
        attention: false,
        displayName: "2345557818",
      },
      {
        uid: "516dd6a1-e326-4971-91ae-49e25053ae3d",
        remoteParty: "2345557818",
        datetimeStarted: "2021-04-29T17:12:54.000",
        duration: 0,
        type: 2,
        attention: false,
        displayName: "2345557818",
      },
    ],
  },
  contactReducer: {
    selectedContact: {
      uid: "",
      phone: [
        {
          value: "2345550282",
          type: 2,
        },
      ],
      postal: [],
      email: [],
      isFavourite: false,
      notifyWhenAvailable: false,
      isTyping: false,
    },
    contacts: [
      {
        uid: "16214496452493519700",
        identity: {
          firstName: "DUIR test",
          lastName: "41",
          nickname: "DUIR test 41",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557841",
            type: 0,
          },
        ],
        im: {
          value: "2345557841@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964507825799886",
        identity: {
          firstName: "DUIR test",
          lastName: "27",
          nickname: "DUIR test 27",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557827",
            type: 0,
          },
        ],
        im: {
          value: "2345557827@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964539230225166",
        identity: {
          firstName: "DUIR test",
          lastName: "22",
          nickname: "DUIR test 22",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557822",
            type: 0,
          },
        ],
        im: {
          value: "2345557822@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496451092217508",
        identity: {
          firstName: "DUIR test",
          lastName: "48",
          nickname: "DUIR test 48",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAADM0lEQVR4Xu2Xd1MaQRjG/f4zUdAoIBKqoBRBKUFQo6LSx0KxUtRo4qR/gif7ronRXQ52nYhOJn/8Zm7u3vJwb9lj5JXFjZfIiHjjpfBfmC7/pjDTtA9WTwSuYAK+hTSHrukePRPtdXiUMLN9lotYL9VRPbpE8/wzTq6+c+ia7q2XGtyGbEV/FbSFjc/4kVgrot654UJOr3/0hJ6RDdmOOwJSnEFoCRuzeRHLbOPo4oskxIijy69YzO5gTLO0WsJmAovYO7mSkg9i7/QKDuYrxuuHlrD4agHH779JiQdBPnFWUjFeP5SFURNvlJtSUlXIV2cQlIVNOueRPziTEqqSP2jxGGJcI5SFWdwhFOsdKaEq5EsxxLhGKAubImG1tpRQlScTNukK8nKICVUp1FqYYjHEuEYoC7N6wig3z6WEqlQOL2DzRqS4RigLc7IzkI4bMaEqh2wpu0NJKa4ResK6n6SEqtCPogNejGuEsjDqD+oTMaEqBTY4T9Jjo1YP0pvVvge3EeSTzlV5DDGuEcrCCH8sg8Yjykk+/lhWitcPLWFUisdMZoX56JSR0BLGP3uy21rlJFv+2cN8xXj90BJG0Amgs2gLzFZn4/9GWxjhYvto//RaEiGyf/ZBa3fdR0sYTRVhtvsRTudw0PrIBPQua619g8jyFswzAebj/TWRf3EqR1lvjDvmYPFG4Yxk4U/tILy6i2C2gmg2j1KjI/0ZKTW6/BnZRN7tYz5TgmdpA/a5FF67QjDRd9mA1WEozDQ9C5t/Cb7EFhY2akgWW0iVO3hLVLqMDqKbdQQzRcRWikiulzlRdk336BnZ3Np2uW+q1MbSzjEX7FxYwYQzaLjbJGE0PbZAHMGVKuL5k3tCepMqtxFnyWK5JocS0z3RTiTJRMZyDbija7zcoo4HwsjAG9+8FdQj2FNAAufZG5xwPpzcO2Em1tC+RI6/btH5yWFVoT6kXpaE2edTSBTOZKchQT3sCKVlYa7oKu4363PgYv0mCXsTzvB6i8bDIllibyy8LAuz+eN8ukSHYUHTbJ3982/9TpiZNV54bVdyGBa02+hEkYTRoqMBeI6ppPVk8S0+OA1+Ap6+amDJdvt9AAAAAElFTkSuQmCC",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557848",
            type: 0,
          },
        ],
        im: {
          value: "2345557848@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496451516534140",
        identity: {
          firstName: "DUIR test",
          lastName: "08",
          nickname: "DUIR test 08",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557808",
            type: 0,
          },
        ],
        im: {
          value: "2345557808@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453726438257",
        identity: {
          firstName: "DUIR test",
          lastName: "56",
          nickname: "DUIR test 56",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557856",
            type: 0,
          },
        ],
        im: {
          value: "2345557856@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964510533503310",
        identity: {
          firstName: "DUIR test",
          lastName: "50",
          nickname: "DUIR test 50",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,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",
        },
        presence: {
          state: 0,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557850",
            type: 0,
          },
        ],
        im: {
          value: "2345557850@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964520912290888",
        identity: {
          firstName: "DUIR test",
          lastName: "58",
          nickname: "DUIR test 58",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557858",
            type: 0,
          },
        ],
        im: {
          value: "2345557858@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964523511886609",
        identity: {
          firstName: "DUIR test",
          lastName: "70",
          nickname: "DUIR test 70",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 1,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557870",
            type: 0,
          },
        ],
        im: {
          value: "2345557870@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964512233205181",
        identity: {
          firstName: "DUIR test",
          lastName: "29",
          nickname: "DUIR test 29",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557829",
            type: 0,
          },
        ],
        im: {
          value: "2345557829@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964522132630862",
        identity: {
          firstName: "DUIR test",
          lastName: "93",
          nickname: "DUIR test 93",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557893",
            type: 0,
          },
        ],
        im: {
          value: "2345557893@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964529331236249",
        identity: {
          firstName: "DUIR test",
          lastName: "87",
          nickname: "DUIR test 87",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557887",
            type: 0,
          },
        ],
        im: {
          value: "2345557887@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964532518475066",
        identity: {
          firstName: "DUIR test",
          lastName: "77",
          nickname: "DUIR test 77",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557877",
            type: 0,
          },
        ],
        im: {
          value: "2345557877@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964527729738114",
        identity: {
          firstName: "DUIR test",
          lastName: "26",
          nickname: "DUIR test 26",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557826",
            type: 0,
          },
        ],
        im: {
          value: "2345557826@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964518031872140",
        identity: {
          firstName: "DUIR test",
          lastName: "18",
          nickname: "DUIR test 18",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,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",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557818",
            type: 0,
          },
        ],
        im: {
          value: "2345557818@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964524124424873",
        identity: {
          firstName: "DUIR test",
          lastName: "91",
          nickname: "DUIR test 91",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557891",
            type: 0,
          },
        ],
        im: {
          value: "2345557891@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964539031005591",
        identity: {
          firstName: "DUIR test",
          lastName: "74",
          nickname: "DUIR test 74",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557874",
            type: 0,
          },
        ],
        im: {
          value: "2345557874@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453596128274",
        identity: {
          firstName: "DUIR test",
          lastName: "37",
          nickname: "DUIR test 37",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557837",
            type: 0,
          },
        ],
        im: {
          value: "2345557837@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964536713160802",
        identity: {
          firstName: "DUIR test",
          lastName: "94",
          nickname: "DUIR test 94",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 2,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557894",
            type: 0,
          },
        ],
        im: {
          value: "2345557894@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496451298022282",
        identity: {
          firstName: "DUIR test",
          lastName: "20",
          nickname: "DUIR test 20",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557820",
            type: 0,
          },
        ],
        im: {
          value: "2345557820@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964514319085376",
        identity: {
          firstName: "DUIR test",
          lastName: "84",
          nickname: "DUIR test 84",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557884",
            type: 0,
          },
        ],
        im: {
          value: "2345557884@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964519715331502",
        identity: {
          firstName: "DUIR test",
          lastName: "68",
          nickname: "DUIR test 68",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557868",
            type: 0,
          },
        ],
        im: {
          value: "2345557868@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453622924542",
        identity: {
          firstName: "DUIR test",
          lastName: "62",
          nickname: "DUIR test 62",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557862",
            type: 0,
          },
        ],
        im: {
          value: "2345557862@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964515419522684",
        identity: {
          firstName: "DUIR test",
          lastName: "00",
          nickname: "DUIR test 00",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557800",
            type: 0,
          },
        ],
        im: {
          value: "2345557800@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964515731472161",
        identity: {
          firstName: "DUIR test",
          lastName: "51",
          nickname: "DUIR test 51",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,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",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557851",
            type: 0,
          },
        ],
        im: {
          value: "2345557851@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964522517487731",
        identity: {
          firstName: "DUIR test",
          lastName: "45",
          nickname: "DUIR test 45",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557845",
            type: 0,
          },
        ],
        im: {
          value: "2345557845@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964521323363505",
        identity: {
          firstName: "DUIR test",
          lastName: "60",
          nickname: "DUIR test 60",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557860",
            type: 0,
          },
        ],
        im: {
          value: "2345557860@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964535126798629",
        identity: {
          firstName: "DUIR test",
          lastName: "40",
          nickname: "DUIR test 40",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557840",
            type: 0,
          },
        ],
        im: {
          value: "2345557840@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964525517104054",
        identity: {
          firstName: "DUIR test",
          lastName: "69",
          nickname: "DUIR test 69",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557869",
            type: 0,
          },
        ],
        im: {
          value: "2345557869@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964528312702758",
        identity: {
          firstName: "DUIR test",
          lastName: "98",
          nickname: "DUIR test 98",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557898",
            type: 0,
          },
        ],
        im: {
          value: "2345557898@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496451405258617",
        identity: {
          firstName: "DUIR test",
          lastName: "78",
          nickname: "DUIR test 78",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557878",
            type: 0,
          },
        ],
        im: {
          value: "2345557878@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964533912916586",
        identity: {
          firstName: "DUIR test",
          lastName: "99",
          nickname: "DUIR test 99",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557899",
            type: 0,
          },
        ],
        im: {
          value: "2345557899@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453217062618",
        identity: {
          firstName: "DUIR test",
          lastName: "35",
          nickname: "DUIR test 35",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557835",
            type: 0,
          },
        ],
        im: {
          value: "2345557835@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964528026208263",
        identity: {
          firstName: "DUIR test",
          lastName: "24",
          nickname: "DUIR test 24",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557824",
            type: 0,
          },
        ],
        im: {
          value: "2345557824@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964535717992127",
        identity: {
          firstName: "DUIR test",
          lastName: "14",
          nickname: "DUIR test 14",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557814",
            type: 0,
          },
        ],
        im: {
          value: "2345557814@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "1621449645273613950",
        identity: {
          firstName: "DUIR test",
          lastName: "71",
          nickname: "DUIR test 71",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557871",
            type: 0,
          },
        ],
        im: {
          value: "2345557871@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496454079008230",
        identity: {
          firstName: "DUIR test",
          lastName: "44",
          nickname: "DUIR test 44",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557844",
            type: 0,
          },
        ],
        im: {
          value: "2345557844@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964523029732820",
        identity: {
          firstName: "DUIR test",
          lastName: "53",
          nickname: "DUIR test 53",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557853",
            type: 0,
          },
        ],
        im: {
          value: "2345557853@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964531530580300",
        identity: {
          firstName: "DUIR test",
          lastName: "55",
          nickname: "DUIR test 55",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557855",
            type: 0,
          },
        ],
        im: {
          value: "2345557855@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964525216296514",
        identity: {
          firstName: "DUIR test",
          lastName: "36",
          nickname: "DUIR test 36",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557836",
            type: 0,
          },
        ],
        im: {
          value: "2345557836@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496454029988380",
        identity: {
          firstName: "DUIR test",
          lastName: "12",
          nickname: "DUIR test 12",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 0,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557812",
            type: 0,
          },
        ],
        im: {
          value: "2345557812@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964531210627775",
        identity: {
          firstName: "DUIR test",
          lastName: "72",
          nickname: "DUIR test 72",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557872",
            type: 0,
          },
        ],
        im: {
          value: "2345557872@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964540923277848",
        identity: {
          firstName: "DUIR test",
          lastName: "88",
          nickname: "DUIR test 88",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557888",
            type: 0,
          },
        ],
        im: {
          value: "2345557888@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964524416979804",
        identity: {
          firstName: "DUIR test",
          lastName: "49",
          nickname: "DUIR test 49",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557849",
            type: 0,
          },
        ],
        im: {
          value: "2345557849@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496452698550817",
        identity: {
          firstName: "DUIR test",
          lastName: "28",
          nickname: "DUIR test 28",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557828",
            type: 0,
          },
        ],
        im: {
          value: "2345557828@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964533610452667",
        identity: {
          firstName: "DUIR test",
          lastName: "90",
          nickname: "DUIR test 90",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557890",
            type: 0,
          },
        ],
        im: {
          value: "2345557890@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496452475193989",
        identity: {
          firstName: "DUIR test",
          lastName: "73",
          nickname: "DUIR test 73",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557873",
            type: 0,
          },
        ],
        im: {
          value: "2345557873@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964519330447340",
        identity: {
          firstName: "DUIR test",
          lastName: "46",
          nickname: "DUIR test 46",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAFWUlEQVR4Xl2Y25bbOgxD3YeT68y0p///r6mh7R3QedCyrQsJAhSlZHtsz9dte+zt+bput9f1V94f+/t9b9fVbqs/77fXZfXv32vd773d95Yx+jP3sZ5Zl5bxx+u+fb1uu+37bufxK333V3w/97HH/v7c++4LR57318bCNIzej4azAJgAcX7Z39Pozxy+BfMO5h2E8/CROfgARN7PwdxeW1CLlAUM1HmNGX3YohFUnV7WPPoLzPUBaODxeT2UCjhVAvAjjHVRI51sKFtZPYPBGXMEEycEh/PaRBWAXFb7GvYiOWMb+s/FoD4DEjBzwup0hGHf82yOOqbt2/Y9xgMMxsDwXHmXfNyMCPkuR66U2rI0HQv6/2VcyZoS2msAzIn8mf9zPGMjQEwnGHsEGAPoriEMZ1LGzrJW9rl73dnmXJ+uZRz5rm/WIIF8w4ZybjKAfBNYmTLiy5hDxOQSeWF+zTm8Y8NxNwSbp6qYUvRtXYAxd+KnEx3HiUmt0yZvn1NSgCPbdSV7pPxe7zDUNJC5lfwCS441WiNNPw4KPu9fx3MyEVazTml1ljlKH0DfK+nNz9tuC/AG+QxjUJqKDhO+J+dsjLW2xWAiV45KAFgYIvoAwaYJD1MyxkZzw922P2vsANZyIUuVrLngBihrlZv19pkOAiaQzp8Aya1sNDbiN8mvU/LB3aQTkjttbv0yNwEB8ByIaeJGyZjrZdZNZl4mmB8rvyykjlnL7BfY+Uk+THYnQ/OwN6DKq02OHzcI4GR343wTBKDYBAXF+HlDWALMrTLTuXM9a6YaJrsgI+fP8VxS4oQ6Ng9hj4kZdZvACrzOleSclzKTTZMC21ykkKcv+cUpsOqYxU2HZxn73ZuB8wDpjcSngM4M8T3tNhDHkDttVf5eO6bhuRF0ZHX2fPtZ784hcXWCAx17nYEt1meNp4Yso9QCpgEdJMcCRKMWwSYzbJFT1DjeKx/A5uFMWUgg1LXYv6x3ABYUpWNVfiNV8yYyh+5/Q87m1n31s4PT545z7bxnaVvQ+kxLLWuevqXkLkR9aT4p6fVwrrMpp31hjBrVUmIuFUxtz5IxQSorUm/Wj8+kBXkcSjfAOkc5e4TVmdLH4d+XFb7rCwyJrfz1/S6w6YAZkxEWKoXMTDY6Nlsilw1A6RS7HNoFimpnkOsGmwlMJBqZAOw57zwZ2j7lq2yCZwz2ZbN9BpT5MreuPXaWLXfeLB86tgCXLdmFkfMGctxvgu4Vpz5IKYpsAA4pPf0tBxROb7aC0tgE0vxqgAXmGhgx2a1fbLyM5cmVO/0HYwLREedlQeDcIOyrY+VCbgM8g/c785VsKkHuUf8WY9YRZfOK423U3dfbAE6NeLI4nRvIOT30UUn5uahtN8LxF0GibKROqLMpxwQAiHM/7H6WD+12nWMGol9AH78r09gNjW7KQbIKnndlcNMYXOZ7xPU0mKB6NuOv5SXr/ryi4vvHSAdlwbxrxMhsUqd0yBRgPJgBWKC1JVucsQZMn9/5B+ldYCsfG2A6hB1l7rWaaj/zS1kJpCVkBkZw5vEZtCRkzZbk5S8gzyt+mZ8TlVYAfHvvPwPruryXJUFrS5a8zwHI+ccvcc7C1pdGZx58ghBAgvJbFkwL+mFBJQSpD5gKOIhh/Kj8REDuWMv8Lv3kBWOVwG8ZnWwRlDk6GRdsiDCFqGuPg5w3MH8ENKIYPTsHoA4EoNPJEL/oZbn1Dzbwl3n44D3F1f4lZW+aRgAg6GcxkWvYOZaJOnaOwC0b6efo+WSqTFtog2WViyDNNSTPAqgDdtiUBFZxUhkNILuxcpkz83emfXOcxpGU/n8o8fpaF1YpiQAAAABJRU5ErkJggg==",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557846",
            type: 0,
          },
        ],
        im: {
          value: "2345557846@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964540421856803",
        identity: {
          firstName: "DUIR test",
          lastName: "39",
          nickname: "DUIR test 39",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557839",
            type: 0,
          },
        ],
        im: {
          value: "2345557839@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964520531392489",
        identity: {
          firstName: "DUIR test",
          lastName: "95",
          nickname: "DUIR test 95",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557895",
            type: 0,
          },
        ],
        im: {
          value: "2345557895@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964537416533094",
        identity: {
          firstName: "DUIR test",
          lastName: "81",
          nickname: "DUIR test 81",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557881",
            type: 0,
          },
        ],
        im: {
          value: "2345557881@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964538221757102",
        identity: {
          firstName: "DUIR test",
          lastName: "11",
          nickname: "DUIR test 11",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557811",
            type: 0,
          },
        ],
        im: {
          value: "2345557811@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496454004945688",
        identity: {
          firstName: "DUIR test",
          lastName: "82",
          nickname: "DUIR test 82",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557882",
            type: 0,
          },
        ],
        im: {
          value: "2345557882@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964520115101052",
        identity: {
          firstName: "DUIR test",
          lastName: "59",
          nickname: "DUIR test 59",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557859",
            type: 0,
          },
        ],
        im: {
          value: "2345557859@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964526333054331",
        identity: {
          firstName: "DUIR test",
          lastName: "80",
          nickname: "DUIR test 80",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557880",
            type: 0,
          },
        ],
        im: {
          value: "2345557880@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964530129629898",
        identity: {
          firstName: "DUIR test",
          lastName: "54",
          nickname: "DUIR test 54",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557854",
            type: 0,
          },
        ],
        im: {
          value: "2345557854@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964528713205614",
        identity: {
          firstName: "DUIR test",
          lastName: "30",
          nickname: "DUIR test 30",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557830",
            type: 0,
          },
        ],
        im: {
          value: "2345557830@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964535525353467",
        identity: {
          firstName: "DUIR test",
          lastName: "07",
          nickname: "DUIR test 07",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557807",
            type: 0,
          },
        ],
        im: {
          value: "2345557807@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964529727541472",
        identity: {
          firstName: "DUIR test",
          lastName: "42",
          nickname: "DUIR test 42",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557842",
            type: 0,
          },
        ],
        im: {
          value: "2345557842@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964515913356261",
        identity: {
          firstName: "DUIR test",
          lastName: "13",
          nickname: "DUIR test 13",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557813",
            type: 0,
          },
          {
            value: "7813",
            type: 2,
          },
        ],
        im: {
          value: "2345557813@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453484669296",
        identity: {
          firstName: "DUIR test",
          lastName: "16",
          nickname: "DUIR test 16",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557816",
            type: 0,
          },
        ],
        im: {
          value: "2345557816@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964532916396075",
        identity: {
          firstName: "DUIR test",
          lastName: "63",
          nickname: "DUIR test 63",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557863",
            type: 0,
          },
        ],
        im: {
          value: "2345557863@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964530326772850",
        identity: {
          firstName: "DUIR test",
          lastName: "19",
          nickname: "DUIR test 19",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557819",
            type: 0,
          },
        ],
        im: {
          value: "2345557819@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964508917892505",
        identity: {
          firstName: "DUIR test",
          lastName: "85",
          nickname: "DUIR test 85",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557885",
            type: 0,
          },
        ],
        im: {
          value: "2345557885@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964518422212329",
        identity: {
          firstName: "DUIR test",
          lastName: "34",
          nickname: "DUIR test 34",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557834",
            type: 0,
          },
        ],
        im: {
          value: "2345557834@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "1621449645217293101",
        identity: {
          firstName: "DUIR test",
          lastName: "67",
          nickname: "DUIR test 67",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557867",
            type: 0,
          },
        ],
        im: {
          value: "2345557867@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964530624655216",
        identity: {
          firstName: "DUIR test",
          lastName: "33",
          nickname: "DUIR test 33",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557833",
            type: 0,
          },
        ],
        im: {
          value: "2345557833@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964533212593389",
        identity: {
          firstName: "DUIR test",
          lastName: "06",
          nickname: "DUIR test 06",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "7806",
            type: 2,
          },
          {
            value: "2345557806",
            type: 0,
          },
        ],
        im: {
          value: "2345557806@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964513631956236",
        identity: {
          firstName: "DUIR test",
          lastName: "04",
          nickname: "DUIR test 04",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557804",
            type: 0,
          },
        ],
        im: {
          value: "2345557804@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496452615590729",
        identity: {
          firstName: "DUIR test",
          lastName: "17",
          nickname: "DUIR test 17",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAGw0lEQVR4Xu2X21Nb1xXG9be0GHS/HB3dJXRBF3QFKwgQEsYGQQALDBEGYnMxEGxj4xsGE5sSxy7UDp4pcetJ66TuNImn6fSp7UM70z61nelbZ9q/4Nctycax3cyEzqTDgx++Oecsrb3WOtrr+9Y+iu9plRxEKOoTXg4fS1UeavRqvq9TCZSvAs+eq/aXF1b9nl9VDGUdz+zqqv+ze6snTV8hUY1TiVv1f4Gqf61JT9tgiWJ/L6pyYU+efsHE4jxmn4/7n33O2Mleei9us3DnY5bWP6S58yiPvnxKvjO5V5zO7WLhyjmKXWFWN1Z4e+g4f9gaRu1rZOb8Gju3b5ILuOk+dY6ffPpjzt4okS/Nc3NtnaHSFJenuhgt9dI/Osj8rQd8/sUuh9uDuKMxFqf7CIWtKIzJHKrMCFJjKx88+oxP3h8m2hRm9PIKvR0xItk+dp58yUdnW1Abn/1b4g1j0RA33z/P5u0TqGUDu/NxYdcwkTNTyDi4fHoAR6qT5kwTqx8sEWgIEc+3kT89wVB3jgcPr9E7GOfu9kc8uLtMMibjCNTT3d/DIYMKhSrcgj47To09jOR3kog5RAE6LNF2jAE/tc4Q5oZ6khEzh/QvtrIcxPXWEaJBY2Xb2hJyxR5wK7Hb1STCHiwWGdnh4q2WAF6rEovXjC/lJdrSgj3RjMuhJBGQ8Qq4xG8v9ViN0cAh88vGgwDFq4aDAoXBLqOT9dQa1LSmnGTiMockE3qrhMqoFfutQSfu9TZJ3GvR2mS0FsNLQcqM0tvNlR5TyVLFv1YwTiniNES7mRxre8lfJZvQyNUYaouDQqFIa1tI3HsYLg4TS9aj+M2ffsfG+UHiMTc/377A8ayLptIlnuxscmUgTyjdxead2zz92ZaQlT6++uNfubc9XWnQ54l6Jub589//QjjVyNlLa3x89xZvJ4J0T1/i4af3eW+1uOdbI150Zecxjx7dQfJ5mLmxxS9+vUXP9Anmb27xy9/+kKZ8BMXp3TtkCs1YAzYKLQ4G2xw4HWqmchrWSxHxxmmCQRu3pxPkO9Lcvf0DVmZbBRGeFWY00zQwyeZPn3C1oKLUqqEzaeLyqX7cjRmiyThrK4MvCrOFGDm3zM72DY51D+Bv8FIq9TAwt4LX72XuzCBtOVGYPRHFGXGJLTIiWbXINi1Kg2CWTYm33oDepMJs07PyTlCwTY8ka2kQOrMnuHo9dVYbOo+HeqcSq2CfUVbhcVvQS0bRJjL+cFV8KzBZUYu2sHidIpaMyazF7nFidddjMOtw+10Y7cZv3/wqY1XNX7V/V/jWhf2/obB6vdjdViRvPTYxlmxOM3WCjfaGAJLFhNpsEP3nw+5zo3O68TWGsNi1gkFmXKEGIcZlplrwRIpsbYyIeRhh89Ioeot+L4nKKmMWeVx+DxpBGqMYaQ6vG6PTgVzvxSm2Vfk18a61OVFsXFzm8sULjC2vc+vKNS4svidGSTcLq5vMTEwRa88zdWuXxbOzHJ1Z4fFXv2KyJ0D/7Cr/+Oe/hf8EqeF5NrY32NydqQzm0/0xNJJmL5Eve4QLS1e4tX6D5vYCR8bPcX1ljeH5q1xfWmbt+jV8Db49f2vnJIr1yQ6aJidFAYeZGzhMZmEBeypLXDTy8JUp9EmhQc1Vuge7sqTHioyeLVIsjrK2PEdXUczEcCcGycnDe5OvbclznB9uIdzRQvLdRZq9EvEjItfwUVbHs4T7CniP5Pd8y72sONEko3GYke0GjjZKaF0WsZUatIKZRrdEjUkIoUmqLKiTjahsZix+wULBII2kFXY1dQa9kA+t2J7qvPxv6I1JGG0GNHYhwOIwoJbFevE8lJIFS40oXxFtxdeZ9l2y7ptif5P94LIy2p4jFhbskgwE20QPdXViiwu1j/qIxv0YHBaacnnSHXHBWhf3FrP4/RbcyQztuXYcYnstgQaynRlSGbEu28PW/ftC/b2vJdsPFH2TZ5heuCAauEDn+CwnBSvTAyMsT6TZXuqmVRT6+7/9i90fzRFtjvL4xnECQScnxk9y9+oUy31pQl0TnDkzzicfzlVYOTI2RK4j+Fqy/UCR9yk5eqpAIpPieLuTrnemiMS8nBdsufZuG+m4h1NDx1g63Sr+VQ2zBQ8ul55MWEkupmZ5KERjvQVbxMOD2UglqCvoq5zjX022HyjKwlYn2FU+9pTHjtJsFCcHtShCJyDsYljXCVEsF1Wej2WfGnGt1VehNokPCV351CAGf7f7tQT/KxRKoewHEQqtOOAdRLwpbL94U9h+oSh/HBxEHNxZ+arhoOBNYfvFm8L2izeF7Rf/AcMyVae+JN9ZAAAAAElFTkSuQmCC",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557817",
            type: 0,
          },
        ],
        im: {
          value: "2345557817@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964508429853137",
        identity: {
          firstName: "DUIR test",
          lastName: "43",
          nickname: "DUIR test 43",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557843",
            type: 0,
          },
        ],
        im: {
          value: "2345557843@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453957775489",
        identity: {
          firstName: "DUIR test",
          lastName: "65",
          nickname: "DUIR test 65",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557865",
            type: 0,
          },
        ],
        im: {
          value: "2345557865@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964504827256115",
        identity: {
          firstName: "DUIR test",
          lastName: "03",
          nickname: "DUIR test 03",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557803",
            type: 0,
          },
        ],
        im: {
          value: "2345557803@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964529024881633",
        identity: {
          firstName: "DUIR test",
          lastName: "89",
          nickname: "DUIR test 89",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557889",
            type: 0,
          },
        ],
        im: {
          value: "2345557889@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964511330547570",
        identity: {
          firstName: "DUIR test",
          lastName: "66",
          nickname: "DUIR test 66",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557866",
            type: 0,
          },
        ],
        im: {
          value: "2345557866@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496451881762839",
        identity: {
          firstName: "DUIR test",
          lastName: "21",
          nickname: "DUIR test 21",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557821",
            type: 0,
          },
        ],
        im: {
          value: "2345557821@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453793261100",
        identity: {
          firstName: "DUIR test",
          lastName: "52",
          nickname: "DUIR test 52",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,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",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557852",
            type: 0,
          },
        ],
        im: {
          value: "2345557852@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964517122913962",
        identity: {
          firstName: "DUIR test",
          lastName: "57",
          nickname: "DUIR test 57",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557857",
            type: 0,
          },
        ],
        im: {
          value: "2345557857@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964510013619339",
        identity: {
          firstName: "DUIR test",
          lastName: "75",
          nickname: "DUIR test 75",
          jobTitle: "",
          organisation: "",
          profilePicture:
            "data:image/png;base64,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",
        },
        presence: {
          state: 0,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557875",
            type: 0,
          },
        ],
        im: {
          value: "2345557875@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964538723430197",
        identity: {
          firstName: "DUIR test",
          lastName: "31",
          nickname: "DUIR test 31",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557831",
            type: 0,
          },
        ],
        im: {
          value: "2345557831@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964517412779130",
        identity: {
          firstName: "DUIR test",
          lastName: "32",
          nickname: "DUIR test 32",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 0,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557832",
            type: 0,
          },
        ],
        im: {
          value: "2345557832@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964509511075212",
        identity: {
          firstName: "DUIR test",
          lastName: "10",
          nickname: "DUIR test 10",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557810",
            type: 0,
          },
        ],
        im: {
          value: "2345557810@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964534426864302",
        identity: {
          firstName: "DUIR test",
          lastName: "01",
          nickname: "DUIR test 01",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557801",
            type: 0,
          },
        ],
        im: {
          value: "2345557801@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964511725674443",
        identity: {
          firstName: "DUIR test",
          lastName: "79",
          nickname: "DUIR test 79",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557879",
            type: 0,
          },
        ],
        im: {
          value: "2345557879@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964525827116090",
        identity: {
          firstName: "DUIR test",
          lastName: "83",
          nickname: "DUIR test 83",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557883",
            type: 0,
          },
        ],
        im: {
          value: "2345557883@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496453762874458",
        identity: {
          firstName: "DUIR test",
          lastName: "15",
          nickname: "DUIR test 15",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557815",
            type: 0,
          },
        ],
        im: {
          value: "2345557815@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964531833550963",
        identity: {
          firstName: "DUIR test",
          lastName: "61",
          nickname: "DUIR test 61",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557861",
            type: 0,
          },
        ],
        im: {
          value: "2345557861@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964516829464637",
        identity: {
          firstName: "DUIR test",
          lastName: "47",
          nickname: "DUIR test 47",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557847",
            type: 0,
          },
        ],
        im: {
          value: "2345557847@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964536914258363",
        identity: {
          firstName: "DUIR test",
          lastName: "05",
          nickname: "DUIR test 05",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "7805",
            type: 2,
          },
          {
            value: "2345557805",
            type: 0,
          },
        ],
        im: {
          value: "2345557805@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964513120344852",
        identity: {
          firstName: "DUIR test",
          lastName: "92",
          nickname: "DUIR test 92",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557892",
            type: 0,
          },
        ],
        im: {
          value: "2345557892@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964526628963646",
        identity: {
          firstName: "DUIR test",
          lastName: "86",
          nickname: "DUIR test 86",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557886",
            type: 0,
          },
        ],
        im: {
          value: "2345557886@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964512520371728",
        identity: {
          firstName: "DUIR test",
          lastName: "09",
          nickname: "DUIR test 09",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557809",
            type: 0,
          },
        ],
        im: {
          value: "2345557809@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964514723681184",
        identity: {
          firstName: "DUIR test",
          lastName: "25",
          nickname: "DUIR test 25",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557825",
            type: 0,
          },
        ],
        im: {
          value: "2345557825@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964530929840960",
        identity: {
          firstName: "DUIR test",
          lastName: "38",
          nickname: "DUIR test 38",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557838",
            type: 0,
          },
        ],
        im: {
          value: "2345557838@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964538527416855",
        identity: {
          firstName: "DUIR test",
          lastName: "23",
          nickname: "DUIR test 23",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557823",
            type: 0,
          },
        ],
        im: {
          value: "2345557823@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964536421299076",
        identity: {
          firstName: "DUIR test",
          lastName: "76",
          nickname: "DUIR test 76",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557876",
            type: 0,
          },
        ],
        im: {
          value: "2345557876@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964517712921241",
        identity: {
          firstName: "DUIR test",
          lastName: "97",
          nickname: "DUIR test 97",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557897",
            type: 0,
          },
        ],
        im: {
          value: "2345557897@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "16214496452382376081",
        identity: {
          firstName: "DUIR test",
          lastName: "64",
          nickname: "DUIR test 64",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 6,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557864",
            type: 0,
          },
        ],
        im: {
          value: "2345557864@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
      {
        uid: "162144964539830657238",
        identity: {
          firstName: "DUIR test 02 long contact",
          lastName: "nameee",
          nickname: "DUIR test 02 long contact nameee",
          jobTitle: "",
          organisation: "",
        },
        presence: {
          state: 0,
          customStatus: "",
        },
        phone: [
          {
            value: "2345557802",
            type: 0,
          },
        ],
        im: {
          value: "2345557802@ams-mariobros.metaswitch.com",
        },
        postal: [],
        email: [],
        isFavourite: false,
        notifyWhenAvailable: false,
        isTyping: false,
        types: {
          typeBGContact: true,
          typeIMContact: true,
          typeGroupContact: false,
          typePersonalContact: false,
        },
      },
    ],
  },
  coreReducer: {
    account: {
      loginState: 1,
      connectivityState: undefined,
    },
  },
  paneManagementReducer: {
    activeMidPane: "calls",
    activeRightPane: "contactDetails",
    displayFavs: true,
    searchTerm: "",
    searchResultsCount: 99,
    focusSearch: 1,
    focusMessage: 0,
    disabledCallButton: "",
    showUnimplementedPopup: false,
    showBugReportPopup: false,
    showModalPopup: ModalPopupTypes.noModal,
    customStatusState: 0,
    presenceMenuState: 0,
    isMainWindowFocused: true,
    banners: [],
    isMidPaneDialPadVisible: false,
    forceMessageRemoteParty: "",
  },
  messagingReducer: {
    chats: [
      {
        uid: "2345557899@ams-mariobros.metaswitch.com",
        participant: [
          {
            value: "",
          },
          {
            value: "2345557899@ams-mariobros.metaswitch.com",
          },
        ],
        message: [
          {
            uid: "2a2bb0c4-b42a-469e-afba-f819c453a18f",
            timestamp: "2021-05-24T20:46:13.783",
            type: 0,
            content: "ping",
            edited: false,
            read: true,
            recipient: undefined,
            author: {
              value: "",
            },
          },
        ],
        isNew: false,
        chatName: "",
      },
    ],
    drafts: {},
  },
  meetingReducer: {
    meetings: [],
  },
  settingsReducer: {
    settings: {
      meetings: {
        enabled: true,
      },
      messaging: {
        enabled: true,
        isSignedIn: true,
        groupChatEnabled: true,
        smsEnabled: true,
      },
      call: {
        voipEnabled: true,
        clickToDialType: ClickToDialType.CTD_REMOTE,
        callManagerType: CallManagerType.NONE,
        callJumpEnabled: true,
        voicemailEnabled: true,
        callParkActive: true,
      },
      general: {
        displayName: "DUIR test 96",
        accountNumber: "2345557896",
        bgLineType: BGLineType.BG_LINE,
        isNseriesConfEnabled: true,
        easRegion: "GB",
        javaLocale: "en-GB",
      },
    },
  },
  voicemailsReducer: {
    voicemailFaxCount: {
      newMessages: 2,
    },
  },
  userReducer: {
    user: {
      presence: {
        state: 0,
        customStatus: "",
      },
    },
  },
  windowReducer: {
    type: WindowTypes.main,
  },
};
