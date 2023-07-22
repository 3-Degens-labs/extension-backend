### Degen Backend for Degen Frontend

Will try to return a data about a user address.

### Try

```Markdown
https://3degens.club/check/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### Return Value
```TypeScript
interface MyData {
  haveWorldCoin: boolean;
  lastPoap: LastPoap;
  latestOutboundTransactionDate: string;
  totalTransactionHappenedOverLast7DaysTotal: number;
  calculateTotalTransactionsLast7DaysFromOwner: number;
  chainIDsWithActivity: number[];
  hasNotDumbTransaction: boolean;
}
```
### Description

1. **haveWorldCoin** (boolean): Indicates whether the user has the "World Coin" or not. If true, it means the user possesses the "World Coin," and if false, it means the user does not have it.

2. **lastPoap** (object): Contains information about the last Proof of Attendance (Poap) token the user received. Poap tokens are typically used to represent attendance or participation in events. 
**This field contains the following sub-fields:**
 
  A) **address** (string): The address of the user's Poap token, represented as a hexadecimal string.

  B) **created** (string): The timestamp indicating when the Poap token was created, represented in the format "YYYY-MM-DD HH:mm:ss".

  C) **tokenId** (string): The unique identifier of the Poap token, represented as a string.

  D) **blockchain** (string): The name of the blockchain on which the Poap token is issued (e.g., "xdai").

  E) **name** (string): The name of the Poap token, which is often related to the event or purpose of the token.

  F) **description** (string): A detailed description of the Poap token, typically including information about the event attended and additional details.

  G) **imageUrl** (string): The URL pointing to the image associated with the Poap token.

  H) **animationUrl** (string): The URL pointing to the animation associated with the Poap token, if applicable.

  I) **previewLink** (string): The URL providing a preview of the Poap token or additional information.

  J) **traits** (array of objects): An array of traits or attributes associated with the Poap token, each represented by an object with trait_type (string) and value (string) fields.
 
  Q) **owner** (array of strings): An array containing the addresses of users who own this specific Poap token.

3. **latestOutboundTransactionDate** (string): The timestamp indicating the date and time of the latest outbound transaction made by the user. An outbound transaction typically means a transaction sent from the user's address to another address on the blockchain.
4. **totalTransactionHappenedOverLast7DaysTotal** (number): The total number of transactions that occurred for the user over the last 7 days.
5. **calculateTotalTransactionsLast7DaysFromOwner** (number): The number of transactions that occurred in the last 7 days involving the user's address as the owner.
6. **chainIDsWithActivity** (array of numbers): An array containing the chain IDs where the user's address was involved in one or more transactions.
7. **hasNotDumbTransaction** (boolean): A flag indicating whether the user has any non-trivial (not dumb) transactions. If true, it means the user has at least one non-trivial transaction, and if false, it means there are no non-trivial transactions.