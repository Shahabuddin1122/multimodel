import 'package:flutter/material.dart';
import 'package:mobile/utils/constants.dart';
import 'package:mobile/widgets/conversation.dart';

class Home extends StatelessWidget {
  const Home({super.key});

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
      ),
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: [
            const TextField(
              decoration: InputDecoration(
                hintText: "Search...",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(
                    Radius.circular(100),
                  ),
                ),
                prefixIcon: Icon(Icons.search),
              ),
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(
                  vertical: 20,
                ),
                child: ListView.builder(
                  itemCount: 2,
                  itemBuilder: (context, index) => const ConversationItem(
                    imagePath: 'assets/image/me.png',
                    userName: 'Shahabuddin Akhon',
                    lastMessageTime: '10:30 AM',
                  ),
                ),
              ),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/chat');
        },
        child: const Icon(
          Icons.add,
          color: PRIMARY_COLOR,
          size: 32,
        ),
      ),
    );
  }
}
