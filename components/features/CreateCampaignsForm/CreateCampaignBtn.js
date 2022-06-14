import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { NftContext } from "../../../context/NftContext";
import CreateCampaignForm from "./CreateCampaignForm";

export const CreateCampaignBtn = () => {
  const { isAuthorizedUser } = useContext(NftContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <CreateCampaignForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      {isAuthorizedUser && (
        <button
          onClick={() => {
            setModalIsOpen(true);
          }}
          className="my_campaings_btn py-2 px-6 mx-2 rounded"
        >
          My Campaigns
        </button>
      )}
    </>
  );
};
