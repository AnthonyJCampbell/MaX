// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { handleMessage } from "node-server/data-fan/data-fan";
import { changeLanguage } from "node-server/localisation/i18n";
import { sendWispaMessage } from "node-server/ipc-renderer/window-messaging";
import { WispaMessage } from "node-server/types";

jest.mock("node-server/electron-wrapper");
jest.mock("electron-is-dev", () => false);
jest.mock("node-server/ipc-renderer/window-messaging");
jest.mock("node-server/localisation/i18n");

describe("data fan", () => {
  it("Receiving java locale changes node language and passes message to react", () => {
    const javaLocaleMessage = new WispaMessage();
    javaLocaleMessage.data.settings = { general: { javaLocale: "test" } };
    handleMessage(javaLocaleMessage);
    expect(changeLanguage).toHaveBeenCalledWith("test");
    expect(sendWispaMessage).toHaveBeenCalled();
  });
});
