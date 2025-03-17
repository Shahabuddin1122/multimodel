import 'package:flutter/material.dart';
import 'package:mobile/utils/constants.dart';

class Chat extends StatefulWidget {
  const Chat({super.key});

  @override
  State<Chat> createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  final TextEditingController _controller = TextEditingController();
  List<Map<String, String>> messages = [
    {"sender": "user", "text": "Hello, how are you?"},
    {
      "sender": "llm",
      "text": "I'm doing well, thank you! How can I assist you today?"
    },
    {"sender": "user", "text": "Can you tell me about the weather?"},
    {
      "sender": "llm",
      "text": "Sure! The weather is sunny with a slight breeze."
    },
    {"sender": "user", "text": "Thanks!"},
  ];

  void _sendMessage() {
    if (_controller.text.isNotEmpty) {
      setState(() {
        messages.add({"sender": "user", "text": _controller.text});
        _controller.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "MultiLLM",
          style: TextStyle(
            color: Colors.white,
          ),
        ),
        backgroundColor: PRIMARY_COLOR,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                var message = messages[messages.length - 1 - index];
                bool isUser = message["sender"] == "user";
                return Align(
                  alignment:
                      isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(
                        vertical: 5.0, horizontal: 20.0),
                    padding: const EdgeInsets.symmetric(
                        vertical: 10.0, horizontal: 25.0),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.blueAccent : Colors.grey[300],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      message["text"]!,
                      style: TextStyle(
                        color: isUser ? Colors.white : Colors.black,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "Type a message...",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(
                    Icons.send,
                    size: 32,
                  ),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
