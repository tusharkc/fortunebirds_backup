import React from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { NftContext } from "../../../context/NftContext";
import SweetAlert from "react-bootstrap-sweetalert";
import { useState, useEffect } from "react";

const CreateCampaignForm = ({ modalIsOpen, setModalIsOpen }) => {
  function closeModal() {
    setModalIsOpen(false);
  }

  const {
    isCampaignCreateationSussessful,
    createCampaign,
    transactionIdFromCreation,
    erroMsg,
  } = useContext(NftContext);
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await createCampaign({
      ...data,
      asset_ids: [],
      templateID: 0,
      quantity_req: 0,
    });
  };

  useEffect(() => {
    if (transactionIdFromCreation) {
      setShowAlert(true);
      setModalIsOpen(false);
    } else if (erroMsg != "") {
      console.log(erroMsg);
      setShowError(true);
      setModalIsOpen(false);
    }
  }, [erroMsg, transactionIdFromCreation]);

  return (
    <>
      <SweetAlert
        success
        show={showAlert}
        style={{ color: "white", backgroundColor: "#1d2228" }}
        title="Campaign Created!"
        onConfirm={() => {}}
        customButtons={
          <>
            <button
              onClick={() => {
                setShowAlert(false);
              }}
              style={{ backgroundColor: "#5f5dbb !important" }}
              className=" px-6 py-3"
            >
              OK
            </button>
          </>
        }
      >
        <p>Transaction Id : {transactionIdFromCreation} </p>
      </SweetAlert>

      <SweetAlert
        danger
        show={showError}
        style={{ backgroundColor: "#1d2228" }}
        title=""
        onConfirm={() => {}}
        customButtons={
          <>
            <button
              onClick={() => {
                setShowError(false);
              }}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3"
            >
              OK
            </button>
          </>
        }
      >
        <p>{erroMsg}</p>
      </SweetAlert>

      <SweetAlert
        style={{ width: "640px", backgroundColor: "#1d2228" }}
        className={"flex mx-auto"}
        custom
        show={modalIsOpen}
        showConfirm={false}
        showCancel={false}
        showCloseButton={false}
        title=""
        onConfirm={() => {}}
      >
        <div className="w-full h-full campaign_creation_form">
          <h2 className="text-3xl font-bold text-center text-white">
            Fortune Center
          </h2>

          <img
            width={200}
            className={"mx-auto my-4"}
            src="/media/campaign_creation_illustration.png"
          />

          <p className="text-center text-white flex items-center justify-center bg-sky-600 py-2">
            <img
              width={15}
              className="mx-2"
              src="/media/icons/thumbtack-solid.svg"
            />
            How to transfer the asset to the smart contract? Read FAQs
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="m-3">
            <div className="flex flex-wrap">
              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Campaigns ID
                </label>
                <input
                  {...register("id", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="Enter ID"
                  name="id"
                  type={"number"}
                />
              </div>

              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Authorized Account
                </label>
                <input
                  {...register("authorized_account", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="Enter Account"
                  name="authorized_account"
                  type={"text"}
                />
              </div>

              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Entry Cost
                </label>
                <input
                  {...register("entrycost", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="PXL Amount"
                  name="entrycost"
                  type={"text"}
                />
              </div>

              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Contract Name
                </label>
                <input
                  {...register("contract_account", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="Entry Contract Name"
                  name="contract_account"
                  type={"text"}
                />
              </div>

              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Time in Seconds
                </label>
                <input
                  {...register("loop_time_seconds", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="Convert time to Seconds"
                  name="loop_time_seconds"
                  type={"number"}
                />
              </div>

              <div className="form_group flex flex-col mx-3 my-1">
                <label className="form_label text-center font-semibold">
                  Max Users
                </label>
                <input
                  {...register("max_users", { required: true })}
                  className="form_input py-2 rounded-md text-white px-3 font-semibold my-2"
                  placeholder="Enter Capacity"
                  name="max_users"
                  type={"text"}
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="create_campaign_button px-5 py-2 rounded-lg text-white font-semibold mx-2"
              >
                Create
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 px-5 py-2 rounded-lg text-white font-semibold mx-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </SweetAlert>
    </>
  );
};

export default CreateCampaignForm;
