// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the 'Audio' menu.
 * Contains radio buttons and sliders for audio options whilst in a call.
 *
 * Not currently used as the "audio" button just mutes/unmutes.
 */

import React from "react";
import PropTypes from "prop-types";

import { Menu } from "components/menu/menu";

/**
 * TODO - If this component is ever used again its strings should be added back to the translations
 * files
 */
const AudioMenu = ({ keyboardNavTools }) => {
  const idList = [
    "mic-sameAsSystem",
    "mic-builtInMicrophone",
    "mic-headset",
    "mic-volume",
    "speaker-sameAsSystem",
    "speaker-builtInMicrophone",
    "speaker-headset",
    "speaker-volume",
  ];

  return (
    // TODO - If this component is ever used again its strings should be added back to the
    // translations files
    <Menu keyboardNavTools={keyboardNavTools} idList={idList}>
      {/* <Section borderBottom={true}>
        <Title text={t("microphone")} />
        <RadioButtons
          activeImage={Tick}
          buttons={[
            [t("sameAsSystem"), idList[0]],
            [t("builtInMicrophone"), idList[1]],
            [t("headset"), idList[2]],
          ]}
        />
        <Slider label="Volume" id={idList[3]} />
      </Section>
      <Section>
        <Title text={"Speaker"} />
        <RadioButtons
          activeImage={Tick}
          buttons={[
            [t("sameAsSystem"), idList[4]],
            [t("builtInOutput"), idList[5]],
            [t("headset"), idList[6]],
          ]}
        />
        <Slider label="Volume" id={idList[7]} />
      </Section> */}
    </Menu>
  );
};

AudioMenu.propTypes = {
  keyboardNavTools: PropTypes.object,
};

export default AudioMenu;
