# LLM Architecture

Understanding what happens inside the model helps you debug unexpected behavior.

## The Transformer
Introduced in 2017 ("Attention is All You Need").
- **Encoders (BERT):** Good at understanding context and classification.
- **Decoders (GPT):** Good at generating text (next-token prediction).
- **Encoder-Decoder (T5, BART):** Good at translation and summarization.

## Attention Mechanism
Self-attention allows the model to weigh the importance of every token in the context window relative to the current token being processed.

## Sparse MoE (Mixture of Experts)
Models like Mixtral 8x7B don't use all parameters for every token. They route tokens to specialized "expert" sub-networks, making inference much faster while maintaining high capability.