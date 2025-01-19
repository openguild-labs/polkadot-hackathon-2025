import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    fromAddress: string;

    @Column()
    toAddress: string;

    @Column()
    fromChain: string;

    @Column()
    toChain: string;

    @Column()
    fromAsset: string;

    @Column()
    toAsset: string;

    @Column('int')
    amount: number;

    @Column()
    orderHash: string;

    @Column()
    vaultAddress: string;

    @Column({nullable: true,
    })
    vaultPrivKey: string;

    @Column()
    status: string;

    @Column(
       { nullable: true,}
    )
    srcTxid: string;

    @Column({nullable: true,
    })
    dstTxid: string;
}


// {
//     "toAddress": "bcrt1pe4lrr9et8m05w4nacuvv84j8rjah9m0ef75lx0uh7tyvln30ljcs9p0vmw",
//     "fromAddress": "0x6d96AfD96b1091B52c95784B5a3a1Bd5cB614180",
//     "toChain": "bitcoin",
//     "fromChain": "ethereum",
//     "toAsset": "btc",
//     "fromAsset": "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
//     "amount": 2000
// }


// {
//     "fromAddress": "bcrt1pe4lrr9et8m05w4nacuvv84j8rjah9m0ef75lx0uh7tyvln30ljcs9p0vmw",
//     "toAddress": "0x6d96AfD96b1091B52c95784B5a3a1Bd5cB614180",
//     "fromChain": "bitcoin",
//     "toChain": "ethereum",
//     "fromAsset": "btc",
//     "toAsset": "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
//     "amount": 2000
// }