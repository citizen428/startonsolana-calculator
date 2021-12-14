import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Mycalculatordapp } from '../target/types/mycalculatordapp';
import { assert } from 'chai';

describe('mycalculatordapp', () => {
  const provider = anchor.Provider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp as Program<Mycalculatordapp>;

  let _calculator;

  it('Creates a calculator', async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert(account.greeting === "Welcome to Solana");
    _calculator = calculator;
  });

  it("Adds two numbers", async function() {
    const calculator = _calculator;

    await program.rpc.calculate(new anchor.BN(2), new anchor.BN(3), "+", {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert(account.result.eq(new anchor.BN(5)));
    assert(account.greeting === "Welcome to Solana");
  });

  it('Multiplies two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.calculate(new anchor.BN(2), new anchor.BN(3), "*", {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert(account.result.eq(new anchor.BN(6)));
    assert(account.greeting === "Welcome to Solana");
  })

  it('Subtracts two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.calculate(new anchor.BN(2), new anchor.BN(3), "-", {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert(account.result.eq(new anchor.BN(-1)));
    assert(account.greeting === "Welcome to Solana");
  });

  it('Divides two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.calculate(new anchor.BN(11), new anchor.BN(5), "/", {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(2)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to Solana");
  });
});
