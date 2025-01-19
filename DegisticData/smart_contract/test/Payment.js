const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payment Contract", function () {
  let PaymentContract;
  let paymentContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    PaymentContract = await ethers.getContractFactory("payment");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    paymentContract = await PaymentContract.deploy();
    await paymentContract.deployed();
  });

  it("Should return all payments", async function () {
    const payments = await paymentContract.getAllPayments();
    expect(payments).to.be.an('array').that.is.empty;
  });

  it("Should create and return a payment detail", async function () {
    const deliveryId = ethers.utils.formatBytes32String("delivery1");
    const receiver = addr1.address;
    const amount = ethers.utils.parseEther("1.0");

    await paymentContract.createPayment(receiver, deliveryId, { value: amount });

    const payment = await paymentContract.getDetailPayment(deliveryId);
    expect(payment.amount).to.equal(amount);
    expect(payment.receiver).to.equal(receiver);
    expect(payment.sender).to.equal(owner.address);
  });
});